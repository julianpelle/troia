import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SECCIONES_TROIA } from './secciones-troia';

/**
 * Motor único de TROIA: un solo audio, una sola onda, un solo estado "hablando".
 * La página le avisa en qué sección está y él decide si habla.
 */
@Injectable({ providedIn: 'root' })
export class TroiaService {
  private readonly _hablando = new BehaviorSubject<boolean>(false);
  readonly hablando$ = this._hablando.asObservable();

  private readonly audio = new Audio();
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private freqData = new Uint8Array(0);

  private seccionActual: string | null = null;
  private pendiente: string | null = null;
  private espera: ReturnType<typeof setTimeout> | null = null;
  private token = 0;
  private huboGesto = false;

  /** tiempo que hay que quedarse en una sección para que TROIA hable (evita que arranque al pasar scrolleando) */
  private readonly RETARDO_MS = 600;

  constructor() {
    // Los navegadores no dejan reproducir audio hasta que hay un gesto del usuario.
    // Si TROIA tiene que hablar antes de eso, queda en espera y arranca en el primer gesto.
    const alGesto = () => {
      this.huboGesto = true;
      if (this.pendiente && this.pendiente === this.seccionActual) {
        const id = this.pendiente;
        this.pendiente = null;
        this.reproducir(id);
      }
    };
    for (const ev of ['pointerdown', 'keydown', 'touchend']) {
      window.addEventListener(ev, alGesto, { passive: true });
    }
  }

  /** La página llama a esto cuando la sección `id` pasa a estar en pantalla. */
  entrarSeccion(id: string): void {
    if (id === this.seccionActual) return; // misma sección: no se toca el audio que esté sonando
    this.seccionActual = id;
    this.pendiente = null;
    this.cancelarEspera();
    this.detener();

    if (!this.audioDe(id)) return;
    this.espera = setTimeout(() => this.arrancar(id), this.RETARDO_MS);
  }

  /** Click sobre TROIA: si habla, se calla; si no, repite la sección actual. */
  alternar(): void {
    if (this._hablando.value) {
      this.detener();
      return;
    }
    if (this.seccionActual) {
      this.cancelarEspera();
      this.reproducir(this.seccionActual);
    }
  }

  /** Espectro actual para dibujar la onda (null si todavía no hay audio). */
  leerEspectro(): ArrayLike<number> | null {
    if (!this.analyser) return null;
    this.analyser.getByteFrequencyData(this.freqData);
    return this.freqData;
  }

  private arrancar(id: string): void {
    if (this.seccionActual !== id) return;
    if (!this.hayGesto()) {
      this.pendiente = id;
      return;
    }
    this.reproducir(id);
  }

  private hayGesto(): boolean {
    const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
    return ua ? ua.hasBeenActive : this.huboGesto;
  }

  private audioDe(id: string): string | undefined {
    return SECCIONES_TROIA.find((s) => s.id === id)?.audio;
  }

  private iniciarGrafo(): void {
    if (this.audioCtx) return;
    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 128;
    this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
    const fuente = this.audioCtx.createMediaElementSource(this.audio);
    fuente.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
  }

  private reproducir(id: string): void {
    const src = this.audioDe(id);
    if (!src) return;

    this.iniciarGrafo();
    if (this.audioCtx?.state === 'suspended') void this.audioCtx.resume();

    const miToken = ++this.token;
    this.audio.pause();
    this.audio.src = src;
    this.audio.currentTime = 0;
    this.audio.onended = () => {
      if (miToken === this.token) this._hablando.next(false);
    };

    this.audio.play().then(() => {
      if (miToken !== this.token) return; // el usuario ya cambió de sección
      this._hablando.next(true);
    }).catch((err) => {
      if (miToken === this.token) this._hablando.next(false);
      console.warn(`TROIA no pudo reproducir ${src}:`, err);
    });
  }

  private detener(): void {
    this.token++;
    this.audio.pause();
    this.audio.onended = null;
    this._hablando.next(false);
  }

  private cancelarEspera(): void {
    if (this.espera) {
      clearTimeout(this.espera);
      this.espera = null;
    }
  }
}

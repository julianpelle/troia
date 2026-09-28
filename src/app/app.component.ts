import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Linea {
  id: number;
  texto: string;
  archivo: string;
  final?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('audioEl') audioRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('circle') circleRef!: ElementRef<HTMLDivElement>;
  @ViewChild('wave') waveRef!: ElementRef<HTMLCanvasElement>;

  lineas: Linea[] = [
    {
      id: 1,
      texto: 'Tranquilo, Tincho. Me doy cuenta por tus pulsaciones que estás tenso. ¿Querés que probemos con algo? Yo me encargo.',
      archivo: 'assets/audios/troia-1.aac'
    },
    {
      id: 2,
      texto: '¿Seguís ahí Martín? Estoy esperando tus indicaciones para arrancar. En 4 segundos lo tenemos listo...',
      archivo: 'assets/audios/troia-2.aac'
    },
    {
      id: 3,
      texto: '¿Lo hacemos juntos?',
      archivo: 'assets/audios/troia-3.aac'
    },
    {
      id: 4,
      texto: '¡Extraordinario trabajo, Martín! Es increíble cómo lograste mantener intacta tu esencia y ese trazo humano tan característico.',
      archivo: 'assets/audios/troia-4.aac',
      final: true
    }
  ];

  hablando = false;
  lineaActual: Linea | null = null;

  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private rafId = 0;
  private freqData: Uint8Array = new Uint8Array(0);

  private readonly BARS = 48;
  private barLevels: number[] = new Array(this.BARS).fill(0);

  get modoClase(): string {
    if (!this.hablando || !this.lineaActual) return 'idle';
    return this.lineaActual.final ? 'modo-verde' : 'modo-azul';
  }

  ngAfterViewInit(): void {
    this.dibujarOnda();
  }

  private initAudioGraph(): void {
    if (this.audioCtx) return;
    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;
    this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

    this.sourceNode = this.audioCtx.createMediaElementSource(this.audioRef.nativeElement);
    this.sourceNode.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);
  }

  reproducir(linea: Linea): void {
    this.initAudioGraph();
    if (this.audioCtx?.state === 'suspended') {
      this.audioCtx.resume();
    }

    const audio = this.audioRef.nativeElement;

    // si es la MISMA línea que ya está sonando: la frena y vuelve a gris
    if (this.hablando && this.lineaActual?.id === linea.id) {
      audio.pause();
      this.hablando = false;
      cancelAnimationFrame(this.rafId);
      this.desvanecerOnda();
      return;
    }

    // matamos cualquier loop de animación anterior ANTES de arrancar uno nuevo,
    // si no quedan dos rAF dibujando al mismo tiempo sobre el canvas.
    cancelAnimationFrame(this.rafId);

    const arrancar = () => {
      audio.src = linea.archivo;
      this.lineaActual = linea;

      audio.play().then(() => {
        this.hablando = true;
        this.animar();
      }).catch((err) => console.error('No se pudo reproducir el audio:', err));

      audio.onended = () => {
        this.hablando = false;
        cancelAnimationFrame(this.rafId);
        this.desvanecerOnda();
      };
    };

    if (this.hablando) {
      // es una línea DISTINTA a la que está sonando: sí pasamos por gris
      this.hablando = false;
      audio.pause();
      this.desvanecerOnda(() => arrancar());
    } else {
      arrancar();
    }
  }

  private animar(): void {
    if (!this.analyser) return;

    this.analyser.getByteFrequencyData(this.freqData);

    // solo usamos el rango bajo/medio (donde vive la voz) y lo espejamos
    // a lo largo de todo el círculo, así reacciona el anillo completo
    // y no solo una porción.
    const binsUtiles = Math.floor(this.freqData.length * 0.5);
    let nivelGlobal = 0;

    for (let i = 0; i < this.BARS; i++) {
      const t = i / this.BARS;
      const tPlegado = t < 0.5 ? t * 2 : (1 - t) * 2;
      const bin = Math.min(binsUtiles - 1, Math.floor(tPlegado * binsUtiles));
      const objetivo = this.freqData[bin] / 255;

      this.barLevels[i] += (objetivo - this.barLevels[i]) * 0.18;
      nivelGlobal += this.barLevels[i];
    }
    nivelGlobal /= this.BARS;

    this.dibujarOnda();

    const circle = this.circleRef.nativeElement;
    circle.style.transform = `scale(${1 + nivelGlobal * 0.06})`;

    if (this.hablando) {
      this.rafId = requestAnimationFrame(() => this.animar());
    }
  }

  /** Dibuja un anillo curvo y suave (ondas), no líneas rectas radiales */
  private dibujarOnda(): void {
    const canvas = this.waveRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const radioBase = 120;
    const extraMax = 55;

    const puntos = this.barLevels.map((nivel, i) => {
      const angulo = (i / this.BARS) * Math.PI * 2 - Math.PI / 2;
      const r = radioBase + nivel * extraMax;
      return { x: cx + Math.cos(angulo) * r, y: cy + Math.sin(angulo) * r };
    });

    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();

    const ultimo = puntos[this.BARS - 1];
    const primero = puntos[0];
    ctx.moveTo((ultimo.x + primero.x) / 2, (ultimo.y + primero.y) / 2);

    for (let i = 0; i < this.BARS; i++) {
      const p = puntos[i];
      const pSig = puntos[(i + 1) % this.BARS];
      const midX = (p.x + pSig.x) / 2;
      const midY = (p.y + pSig.y) / 2;
      ctx.quadraticCurveTo(p.x, p.y, midX, midY);
    }

    ctx.closePath();
    ctx.fillStyle = 'rgba(210, 212, 216, 0.30)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(58, 60, 64, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  private desvanecerOnda(alTerminar?: () => void): void {
    const circle = this.circleRef.nativeElement;
    circle.style.transform = 'scale(1)';

    const paso = () => {
      let sigue = false;
      for (let i = 0; i < this.BARS; i++) {
        this.barLevels[i] += (0 - this.barLevels[i]) * 0.2;
        if (this.barLevels[i] > 0.01) sigue = true;
      }
      this.dibujarOnda();
      if (sigue) {
        requestAnimationFrame(paso);
      } else if (alTerminar) {
        alTerminar();
      }
    };
    paso();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.audioCtx?.close();
  }
}

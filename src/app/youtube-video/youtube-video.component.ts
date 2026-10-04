import { Component, ElementRef, Input, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { TroiaService } from '../troia/troia.service';
import { YoutubeApiService } from './youtube-api.service';

/**
 * Video de YouTube que se coordina con TROIA:
 *  - al darle play, TROIA se calla (y no habla mientras el video suena);
 *  - si TROIA habla (porque tocaste su círculo), el video se pausa;
 *  - si el video sale de pantalla (scroll), se pausa solo.
 */
@Component({
  selector: 'app-youtube-video',
  standalone: true,
  templateUrl: './youtube-video.component.html',
  styleUrl: './youtube-video.component.css'
})
export class YoutubeVideoComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) videoId!: string;
  @Input() titulo = 'Video';

  @ViewChild('destino', { static: true }) destino!: ElementRef<HTMLDivElement>;

  private player: any = null;
  private sonando = false;
  private destruido = false;
  private ratio = 1;
  private ultimoFullscreen = 0;
  private observer: IntersectionObserver | null = null;
  private sub?: Subscription;
  private timerFoco: ReturnType<typeof setTimeout> | null = null;

  /** qué porción del video tiene que verse para considerarlo "en foco" */
  private readonly UMBRAL_FOCO = 0.3;

  private readonly alFullscreen = () => {
    // al salir de pantalla completa la página se reacomoda un instante: se revisa el foco recién después
    this.ultimoFullscreen = performance.now();
    if (this.timerFoco) clearTimeout(this.timerFoco);
    this.timerFoco = setTimeout(() => this.revisarFoco(), 900);
  };

  constructor(
    private host: ElementRef<HTMLElement>,
    private troia: TroiaService,
    private api: YoutubeApiService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.observer = new IntersectionObserver(
      (entradas) => {
        this.ratio = entradas[entradas.length - 1].intersectionRatio;
        if (performance.now() - this.ultimoFullscreen < 900) return;
        this.revisarFoco();
      },
      { threshold: [0, 0.15, this.UMBRAL_FOCO, 0.6, 1] }
    );
    this.observer.observe(this.host.nativeElement);
    document.addEventListener('fullscreenchange', this.alFullscreen);

    // si TROIA empieza a hablar mientras el video suena, gana TROIA
    this.sub = this.troia.hablando$.subscribe((habla) => {
      if (habla && this.sonando) this.player?.pauseVideo?.();
    });

    const YT = await this.api.cargar();
    if (this.destruido) return;

    this.player = new YT.Player(this.destino.nativeElement, {
      host: 'https://www.youtube-nocookie.com',
      videoId: this.videoId,
      playerVars: {
        iv_load_policy: 3,
        cc_load_policy: 0,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        origin: window.location.origin
      },
      events: {
        onReady: () => {
          const iframe: HTMLIFrameElement | undefined = this.player?.getIframe?.();
          if (iframe) {
            iframe.title = this.titulo;
            iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
            iframe.allowFullscreen = true;
          }
        },
        onStateChange: (e: { data: number }) => this.alCambiarEstado(e.data)
      }
    });
  }

  /** 1 = reproduciendo · 2 = pausado · 0 = terminó */
  private alCambiarEstado(estado: number): void {
    if (estado === 1) {
      this.sonando = true;
      this.troia.videoIniciado(this.videoId);
    } else if (estado === 2 || estado === 0) {
      this.sonando = false;
      this.troia.videoDetenido(this.videoId);
    }
  }

  private revisarFoco(): void {
    if (document.fullscreenElement) return; // en pantalla completa nunca se pausa por scroll
    if (this.sonando && this.ratio < this.UMBRAL_FOCO) this.player?.pauseVideo?.();
  }

  ngOnDestroy(): void {
    this.destruido = true;
    if (this.timerFoco) clearTimeout(this.timerFoco);
    document.removeEventListener('fullscreenchange', this.alFullscreen);
    this.observer?.disconnect();
    this.sub?.unsubscribe();
    this.troia.videoDetenido(this.videoId);
    this.player?.destroy?.();
  }
}

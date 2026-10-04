import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { TroiaService } from '../troia/troia.service';

/** La única TROIA de la página: círculo fijo abajo a la derecha con su onda. */
@Component({
  selector: 'app-troia-flotante',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './troia-flotante.component.html',
  styleUrl: './troia-flotante.component.css'
})
export class TroiaFlotanteComponent implements AfterViewInit, OnDestroy {
  @ViewChild('wave') waveRef!: ElementRef<HTMLCanvasElement>;

  private readonly BARS = 32;
  private barLevels: number[] = new Array(this.BARS).fill(0);
  private rafId = 0;
  private sub?: Subscription;

  constructor(public troia: TroiaService) {}

  ngAfterViewInit(): void {
    this.dibujarOnda();
    this.sub = this.troia.hablando$.subscribe((habla) => {
      cancelAnimationFrame(this.rafId);
      if (habla) this.animar();
      else this.desvanecerOnda();
    });
  }

  private animar(): void {
    const freq = this.troia.leerEspectro();
    if (freq && freq.length) {
      const binsUtiles = Math.floor(freq.length * 0.5);
      for (let i = 0; i < this.BARS; i++) {
        const t = i / this.BARS;
        const tPlegado = t < 0.5 ? t * 2 : (1 - t) * 2;
        const bin = Math.min(binsUtiles - 1, Math.floor(tPlegado * binsUtiles));
        const objetivo = freq[bin] / 255;
        this.barLevels[i] += (objetivo - this.barLevels[i]) * 0.2;
      }
    }
    this.dibujarOnda();
    this.rafId = requestAnimationFrame(() => this.animar());
  }

  private desvanecerOnda(): void {
    let sigue = false;
    for (let i = 0; i < this.BARS; i++) {
      this.barLevels[i] += (0 - this.barLevels[i]) * 0.2;
      if (this.barLevels[i] > 0.01) sigue = true;
    }
    this.dibujarOnda();
    if (sigue) this.rafId = requestAnimationFrame(() => this.desvanecerOnda());
  }

  private dibujarOnda(): void {
    const canvas = this.waveRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2;
    const radioBase = 46, extraMax = 22;

    const puntos = this.barLevels.map((nivel, i) => {
      const angulo = (i / this.BARS) * Math.PI * 2 - Math.PI / 2;
      const r = radioBase + nivel * extraMax;
      return { x: cx + Math.cos(angulo) * r, y: cy + Math.sin(angulo) * r };
    });

    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    const ultimo = puntos[this.BARS - 1], primero = puntos[0];
    ctx.moveTo((ultimo.x + primero.x) / 2, (ultimo.y + primero.y) / 2);
    for (let i = 0; i < this.BARS; i++) {
      const p = puntos[i], pSig = puntos[(i + 1) % this.BARS];
      ctx.quadraticCurveTo(p.x, p.y, (p.x + pSig.x) / 2, (p.y + pSig.y) / 2);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(210, 212, 216, 0.28)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(58, 60, 64, 0.9)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.sub?.unsubscribe();
  }
}

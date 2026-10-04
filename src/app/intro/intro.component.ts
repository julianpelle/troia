import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css'
})
export class IntroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('flujo') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() completado = new EventEmitter<void>();

  progreso = 0;
  ipActual = 'localizando dispositivo…';

  private ctx: CanvasRenderingContext2D | null = null;
  private columnas: number[] = [];
  private intervaloFlujo: ReturnType<typeof setInterval> | null = null;
  private intervaloIp: ReturnType<typeof setInterval> | null = null;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ajustar = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.columnas = new Array(Math.floor(canvas.width / 14)).fill(0);
    };
    ajustar();
    window.addEventListener('resize', ajustar);
    this.ctx = canvas.getContext('2d');

    this.intervaloFlujo = setInterval(() => this.dibujarFlujo(), 70);
    this.intervaloIp = setInterval(() => { this.ipActual = this.ipFalsa(); }, 450);

    setTimeout(() => this.avanzar(), 300);
  }

  private dibujarFlujo(): void {
    const canvas = this.canvasRef.nativeElement;
    if (!this.ctx) return;
    this.ctx.fillStyle = 'rgba(7, 8, 10, 0.18)';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = '#ff3b3b';
    this.ctx.font = '12px monospace';
    const chars = '01ABCDEF:.-#$%&';
    for (let i = 0; i < this.columnas.length; i++) {
      const c = chars[Math.floor(Math.random() * chars.length)];
      this.ctx.fillText(c, i * 14, this.columnas[i]);
      if (this.columnas[i] > canvas.height && Math.random() > 0.975) this.columnas[i] = 0;
      this.columnas[i] += 14;
    }
  }

  private rasgos = ['rostro', 'voz', 'trazo', 'memoria', 'huellas', 'rutina', 'forma de pensar', 'miedos', 'gustos'];

private ipFalsa(): string {
  const rasgo = this.rasgos[Math.floor(Math.random() * this.rasgos.length)];
  return `extrayendo ${rasgo} … ${Math.floor(Math.random() * 100)}%`;
}

  private avanzar(): void {
    this.progreso = Math.min(100, this.progreso + 2.2);
    if (this.progreso >= 100) {
      this.limpiar();
      setTimeout(() => this.completado.emit(), 350);
      return;
    }
    setTimeout(() => this.avanzar(), 100);
  }

  private limpiar(): void {
    if (this.intervaloFlujo) clearInterval(this.intervaloFlujo);
    if (this.intervaloIp) clearInterval(this.intervaloIp);
  }

  ngOnDestroy(): void {
    this.limpiar();
  }
}

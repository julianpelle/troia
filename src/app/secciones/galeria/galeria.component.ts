import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
interface Foto { src: string; alt: string; }

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent {
   fotos: Foto[] = Array.from({ length: 6 }, (_, i) => ({
    src: `assets/galeria/still-${i + 1}.jpg`,
    alt: `Foto del corto ${i + 1} de 6`
  }));

  /** índices de fotos que no cargaron (se muestra un placeholder) */
  rotas = new Set<number>();

  porIndice = (i: number): number => i;
}

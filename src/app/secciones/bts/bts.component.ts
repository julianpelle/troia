import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YoutubeVideoComponent } from '../../youtube-video/youtube-video.component';

interface Nota { titulo: string; texto: string; }
interface Foto { src: string; alt: string; }

@Component({
  selector: 'app-bts',
  standalone: true,
  imports: [CommonModule, YoutubeVideoComponent],
  templateUrl: './bts.component.html',
  styleUrl: './bts.component.css'
})
export class BtsComponent {
  notas: Nota[] = [
    {
      titulo: 'Diseño de producción',
      texto: 'El taller de Martín se armó con capas de objetos acumulados a propósito: tazas, libros, bocetos tirados. Cada elemento suma al colapso visual del personaje.'
    },
    {
      titulo: 'Pruebas de cámara',
      texto: 'Se probaron distintas texturas analógicas (VHS, Super 8 digital) para la cámara que representa el "ojo" del espectador dentro de la ficción.'
    },
    {
      titulo: 'Capturas de edición',
      texto: 'El montaje del colapso de Martín se armó con cortes cada vez más cortos, acelerando el ritmo a medida que la presión aumenta.'
    }
  ];

  fotos: Foto[] = Array.from({ length: 6 }, (_, i) => ({
    src: `assets/galeria/bts-${i + 1}.jpg`,
    alt: `Detrás de escena del rodaje, foto ${i + 1} de 6`
  }));

  /** índices de fotos que no cargaron (se muestra un placeholder) */
  rotas = new Set<number>();

  porIndice = (i: number): number => i;
}
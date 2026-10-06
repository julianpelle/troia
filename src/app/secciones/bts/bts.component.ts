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
    texto: 'El espacio de Martín está armado como el de un diseñador con oficio: un corcho con proyectos de logotipo y muestras tipográficas, post-its de colores, bocetos en papel, lápices, tazas a medio terminar y una biblioteca de referencias. Cada objeto cuenta quién es antes de que diga una palabra.'
  },
  {
    titulo: 'Pruebas de cámara',
    texto: 'Para las imágenes de cámara dentro de la ficción se probaron texturas de baja definición (video analógico tipo VHS, distorsión de lente, aberración cromática y formato 4:3) hasta lograr una mirada que se sintiera ajena a la del resto de la película. Reaparece algunas veces a lo largo del corto.'
  },
  {
    titulo: 'Capturas de edición',
    texto: 'El montaje trabaja con dos velocidades: un plano secuencia de casi 46 segundos en el patio, el momento más contemplativo, y un último tramo donde los cortes se acortan a entre 2 y 5 segundos mientras TroIA carga y Martín se acerca a su decisión.'
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
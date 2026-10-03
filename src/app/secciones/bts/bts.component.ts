import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Nota { titulo: string; texto: string; }

@Component({
  selector: 'app-bts',
  standalone: true,
  imports: [CommonModule],
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
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Credito { rol: string; nombre: string; usuario?: string; enlace?: string; }

@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creditos.component.html',
  styleUrl: './creditos.component.css'
})
export class CreditosComponent {
  creditos: Credito[] = [
    { rol: 'Dirección', nombre: 'Juliana Mazza' },
    { rol: 'Producción', nombre: 'Julián Mauro Pellegrini' },
    { rol: 'Asist. de dirección', nombre: 'Julieta Duran Tellez' },
    { rol: 'Dir. de arte', nombre: 'Juanita Munivez Coste' },
    { rol: 'Asist. de arte', nombre: 'Julieta Duran Tellez' },
    { rol: 'Dir. de fotografía / Cámara', nombre: 'Iñaki Rivero' },
    { rol: 'Asist. de fotografía', nombre: 'Juliana Mazza' },
    { rol: 'Sonido', nombre: 'Melisa Fernández' },
    { rol: 'Edición', nombre: 'Julián Mauro Pellegrini' },
    { rol: 'Guion', nombre: 'Juliana Mazza, Melisa Fernández, Julián Mauro Pellegrini' },
    { rol: 'Interfaz IA', nombre: 'Julián Mauro Pellegrini' },
    {
      rol: 'Fotos de rodaje y afiche',
      nombre: 'Giselle E. Cisneros',
      usuario: '@gcisneros.ph',
      enlace: 'https://instagram.com/gcisneros.ph'
    },
    {
      rol: 'Agradecimientos especiales',
      nombre: 'Adelina Gallotti'
    }
  ];
}
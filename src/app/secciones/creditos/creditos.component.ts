import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Credito { rol: string; nombre: string; }

@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creditos.component.html',
  styleUrl: './creditos.component.css'
})
export class CreditosComponent {
  creditos: Credito[] = [
    { rol: 'Cast', nombre: 'Nombre Apellido' },
    { rol: 'Voz de TROIA', nombre: 'Nombre Apellido' },
    { rol: 'Dirección', nombre: 'Juliana Mazza' },
    { rol: 'Producción', nombre: 'Julian Mauro Pellegrini' },
    { rol: 'Asist. de dirección', nombre: 'Julieta Duran Tellez' },
    { rol: 'Dir. de arte', nombre: 'Juanita Munivez Coste' },
    { rol: 'Dir. de fotografía / Cámara', nombre: 'Iñaki Rivero' },
    { rol: 'Sonido', nombre: 'Melisa Fernández' },
    { rol: 'Edición', nombre: 'Julian Mauro Pellegrini' },
    { rol: 'Guion', nombre: 'Julian Mauro Pellegrini, Melisa Fernández, Juliana Mazza' }
  ];
}

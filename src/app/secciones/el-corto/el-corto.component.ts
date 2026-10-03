import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FichaItem { rol: string; nombre: string; }

@Component({
  selector: 'app-el-corto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './el-corto.component.html',
  styleUrl: './el-corto.component.css'
})
export class ElCortoComponent {
  ficha: FichaItem[] = [
    { rol: 'Dirección', nombre: 'Juliana Mazza' },
    { rol: 'Guion', nombre: 'Julian Mauro Pellegrini, Melisa Fernández, Juliana Mazza' },
    { rol: 'Producción', nombre: 'Julian Mauro Pellegrini' },
    { rol: 'Fotografía', nombre: 'Iñaki Rivero' },
    { rol: 'Edición', nombre: 'Julian Mauro Pellegrini' },
    { rol: 'Sonido', nombre: 'Melisa Fernández' },
    { rol: 'Duración', nombre: '4 minutos' },
    { rol: 'Año', nombre: '2026' }
  ];

  reparto: FichaItem[] = [
    { rol: 'Martín', nombre: 'Nombre Apellido' },
    { rol: 'Voz de TROIA', nombre: 'Nombre Apellido' }
  ];
}

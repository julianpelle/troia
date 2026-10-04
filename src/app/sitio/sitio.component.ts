import { Component, ChangeDetectorRef, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroComponent } from '../intro/intro.component';
import { HomeComponent } from '../secciones/home/home.component';
import { ElCortoComponent } from '../secciones/el-corto/el-corto.component';
import { GaleriaComponent } from '../secciones/galeria/galeria.component';
import { BtsComponent } from '../secciones/bts/bts.component';
import { CreditosComponent } from '../secciones/creditos/creditos.component';
import { ContactoComponent } from '../secciones/contacto/contacto.component';
import { TroiaFlotanteComponent } from '../troia-flotante/troia-flotante.component';
import { TroiaService } from '../troia/troia.service';
import { SECCIONES_TROIA } from '../troia/secciones-troia';

@Component({
  selector: 'app-sitio',
  standalone: true,
  imports: [
    CommonModule,
    IntroComponent,
    HomeComponent,
    ElCortoComponent,
    GaleriaComponent,
    BtsComponent,
    CreditosComponent,
    ContactoComponent,
    TroiaFlotanteComponent
  ],
  templateUrl: './sitio.component.html',
  styleUrl: './sitio.component.css'
})
export class SitioComponent implements OnDestroy {
  listo = false;

  private seccionActiva = '';
  private raf = 0;
private reveladorEntrada: IntersectionObserver | null = null;
private reveladorSalida: IntersectionObserver | null = null;
  private scrollAlEntrarFullscreen = 0;

  constructor(public troia: TroiaService, private cdr: ChangeDetectorRef) {}

  alTerminarIntro(): void {
    this.listo = true;
    this.cdr.detectChanges(); // renderiza las secciones antes de observarlas
    this.activarAparicion();
    this.actualizarSeccion();
  }

  /**
   * Los iframes de YouTube abren pantalla completa con la Fullscreen API nativa,
   * que sí dispara este evento en el documento padre aunque el video sea de otro
   * origen. Guardamos el scroll al entrar y lo restauramos al salir, para que no
   * te deje arriba de todo de la página al cerrar el video.
   */
  @HostListener('document:fullscreenchange')
  alCambiarFullscreen(): void {
    if (document.fullscreenElement) {
      this.scrollAlEntrarFullscreen = window.scrollY;
    } else {
      requestAnimationFrame(() => window.scrollTo(0, this.scrollAlEntrarFullscreen));
    }
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  alMoverse(): void {
    if (!this.listo || this.raf) return;
    this.raf = requestAnimationFrame(() => {
      this.raf = 0;
      this.actualizarSeccion();
    });
  }

  /**
   * Sección activa = la última cuyo borde superior ya pasó el 60% de la altura de la pantalla.
   * TROIA solo se entera cuando la sección activa CAMBIA.
   */
  private actualizarSeccion(): void {
    const linea = window.innerHeight * 0.6;
    let activa = '';
    for (const s of SECCIONES_TROIA) {
      const el = document.getElementById(s.id);
      if (el && el.getBoundingClientRect().top <= linea) activa = s.id;
    }
    const alFinal = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    if (alFinal) activa = SECCIONES_TROIA[SECCIONES_TROIA.length - 1].id;

    if (activa && activa !== this.seccionActiva) {
      this.seccionActiva = activa;
      this.troia.entrarSeccion(activa);
    }
  }

  /** Cada bloque con clase .reveal aparece suavemente al entrar en pantalla (y de nuevo si se vuelve a él). */
/** Cada bloque .reveal aparece al entrar en pantalla y se oculta recién cuando queda bien lejos (sin parpadeos). */
private activarAparicion(): void {
  this.reveladorEntrada = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) if (e.isIntersecting) e.target.classList.add('visible');
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0 }
  );
  this.reveladorSalida = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) if (!e.isIntersecting) e.target.classList.remove('visible');
    },
    { rootMargin: '400px 0px 400px 0px', threshold: 0 }
  );
  document.querySelectorAll('.reveal').forEach((el) => {
    this.reveladorEntrada!.observe(el);
    this.reveladorSalida!.observe(el);
  });
}

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
this.reveladorEntrada?.disconnect();
this.reveladorSalida?.disconnect();
    this.troia.entrarSeccion('');
  }
}

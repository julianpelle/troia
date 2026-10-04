export interface SeccionTroia {
  /** id del elemento <section> en la página */
  id: string;
  /** audio que TROIA reproduce al entrar a la sección */
  audio: string;
  /** propuesta de guion para grabar el audio (no se usa en pantalla) */
  guion: string;
}

export const SECCIONES_TROIA: SeccionTroia[] = [
  {
    id: 'home',
    audio: 'assets/audios/home-intro.aac',
    guion: 'Esto es TROIA: doce horas, un trabajo sin terminar y alguien dispuesto a ayudar. Hacé scroll y te cuento cada parte.'
  },
  {
    id: 'el-corto',
    audio: 'assets/audios/corto-intro.aac',
    guion: 'Acá está el cortometraje. Martín tiene que entregar un branding y yo me ofrezco a hacerlo por él. Dale play.'
  },
  {
    id: 'galeria',
    audio: 'assets/audios/galeria-intro.aac',
    guion: 'Algunas imágenes de la película, para que te des una idea del clima.'
  },
  {
    id: 'bts',
    audio: 'assets/audios/bts-intro.aac',
    guion: 'Así se hizo: un video del detrás de escena del rodaje.'
  },
  {
    id: 'creditos',
    audio: 'assets/audios/creditos-intro.aac',
    guion: 'Y estas son las personas que hicieron posible el corto.'
  }
];

import { Injectable } from '@angular/core';

/** Carga una sola vez la API de iframes de YouTube y devuelve el objeto global `YT`. */
@Injectable({ providedIn: 'root' })
export class YoutubeApiService {
  private promesa: Promise<any> | null = null;

  cargar(): Promise<any> {
    if (this.promesa) return this.promesa;

    this.promesa = new Promise((resolve) => {
      const w = window as any;
      if (w.YT && w.YT.Player) {
        resolve(w.YT);
        return;
      }
      const previo = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        if (typeof previo === 'function') previo();
        resolve(w.YT);
      };
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    });

    return this.promesa;
  }
}

# TROIA — Sitio del cortometraje (Angular 17)

```bash
npm install
npm start        # http://localhost:4200
```

## Rutas
- `/` → sitio para espectadores (página común).
- `/shot` → versión del rodaje (drag & drop, alerta, festejo; teclas 1–4 reproducen las líneas de TROIA). Se carga aparte (lazy) recién al entrar.

Si lo publicás en un hosting estático, configurá el fallback a `index.html` para que `/shot` funcione al entrar directo.

## Sitio de espectadores
- Intro "ROBANDO LOS DATOS": al completarse la barra se muestra directo la página.
- **Una sola TROIA**, fija abajo a la derecha (`src/app/troia-flotante`). Habla sola al entrar a cada sección
  (Home, El corto, Galería, BTS, Créditos) y explica esa sección. Solo se corta si tocás el círculo o cambiás de sección;
  al volver a una sección repite su explicación.
- Los navegadores no reproducen audio hasta el primer click/tap/tecla: si TROIA tiene que hablar antes, arranca en ese primer gesto (scrollear no cuenta).
- Cada sección aparece con una transición suave (`.reveal` en `styles.css`).
- Audios y guiones propuestos por sección: `src/app/troia/secciones-troia.ts`.
- Fondo fijo gris en degradé que se tiñe de azul mientras TROIA habla (`sitio.component.css`, color en `styles.css`).
- BTS: video en `src/assets/bts/bts.mp4`.
- Contacto: footer.

## Audios que faltan grabar (en `src/assets/audios/`)
`corto-intro.aac`, `galeria-intro.aac`, `bts-intro.aac`, `creditos-intro.aac`.
`home-intro.aac` hoy es una copia de `troia-1.aac` (la línea del rodaje): hay que reemplazarlo.

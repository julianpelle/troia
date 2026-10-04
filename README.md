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
- Contacto: footer.

## Videos (YouTube)
- **Home**: fondo del hero — mismo video que "El corto" (`aHMMEWffABA`), muteado, en loop, sin controles ni UI,
  `pointer-events: none` (es puramente decorativo). Usa el truco `177.78vh / 56.25vw` en `home.component.css`
  para que el iframe haga de "cover" sin deformarse, más un degradé oscuro encima para que el texto se siga leyendo.
- **El corto**: mismo video (`aHMMEWffABA`), esta vez visible y con controles — es el reproductor real.
- **BTS**: video del detrás de escena (`6aMxObWXvq4`), con controles.
- Los tres usan `youtube-nocookie.com` (modo privacidad) y `cc_load_policy=0&iv_load_policy=3` para que no aparezcan
  subtítulos ni anotaciones por defecto. Ojo: esto no puede anular subtítulos que el espectador haya forzado en su
  propia cuenta de YouTube, eso queda fuera de lo que un embed puede controlar. `rel=0` y `modestbranding=1` ya no
  hacen gran cosa (YouTube los dejó sin efecto en 2018 y 2023 respectivamente) — los dejé puestos por si acaso, pero
  no esperes que oculten el logo o los videos relacionados.
- Al salir de pantalla completa, `sitio.component.ts` escucha `fullscreenchange` en el documento y restaura el
  scroll a donde estabas antes de entrar (el evento sí llega aunque el video sea de otro origen).
- Para cambiar cualquiera de los dos videos, reemplazá el ID en el `src` del iframe correspondiente
  (la parte después de `/embed/` y antes del `?`).

## Nomenclatura de imágenes
- **`src/assets/img.png`** → avatar circular de TROIA (se usa recortado como círculo). Cuadrada, mínimo 300×300px,
  PNG (con o sin transparencia, da igual).
- **`src/assets/galeria/still-1.jpg` a `still-6.jpg`** → fotos de la sección Galería, numeradas sin saltos
  empezando en 1. Se recortan en proporción 4:3 (`object-fit: cover`), así que conviene subirlas ya cerca de esa
  proporción (recomendado mínimo 1200×900px) para que no se vea mal el recorte. Si querés más o menos de 6,
  cambiá el número en `galeria.component.ts`: `Array.from({ length: 6 }, ...)`.
- No hay más imágenes estáticas en el sitio por ahora — BTS y "El corto" ya no usan fotos ni placeholder, son
  los videos de YouTube de arriba.

## Audios que faltan grabar (en `src/assets/audios/`)
`corto-intro.aac`, `galeria-intro.aac`, `bts-intro.aac`, `creditos-intro.aac`.
`home-intro.aac` hoy es una copia de `troia-1.aac` (la línea del rodaje): hay que reemplazarlo.

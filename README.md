# TROIA - Angular 19

## Cómo correrlo
```bash
npm install
npm start
```
Abrí http://localhost:4200

## Archivos que tenés que agregar vos
- `src/assets/img.png` → la imagen que va dentro del círculo.
- `src/assets/audios/troia-1.aac` a `troia-4.aac` → los audios de TROIA, en este orden:
  1. "Tranquilo, Tincho. Me doy cuenta por tus pulsaciones..."
  2. "¿Seguís ahí Martín? Estoy esperando..."
  3. "¿Lo hacemos juntos?"
  4. "¡Extraordinario trabajo, Martín!..." (marcada como `final: true`)

Si tus archivos tienen otro nombre o extensión, cambialos en `src/app/app.component.ts` (array `lineas`, propiedad `archivo`).

## Cómo funciona
- El fondo es un degradé gris futurista (blanco a negro) con luces suaves flotando de fondo.
- El círculo con la imagen queda prácticamente quieto (solo un pulso muy sutil de escala), y alrededor se dibuja en un `<canvas>` una onda circular gris de 48 barras que crecen y decrecen según el nivel de amplitud del audio (Web Audio API `AnalyserNode`), suavizadas frame a frame para que no salten bruscamente.
- Mientras suena una línea normal, el fondo pasa a un degradé azulado (`modo-azul`).
- Mientras suena la línea marcada como `final` (la de "extraordinario trabajo"), el fondo pasa a un degradé verdoso (`modo-verde`), marcando que salió bien.
- Al terminar el audio, la onda se desvanece suavemente y el fondo vuelve al degradé neutro.

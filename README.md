# TROIA - Angular 19

## Cómo correrlo
```bash
npm install
npm start
```
Abrí http://localhost:4200

## Archivos que tenés que agregar vos
- `src/assets/img.png` → la imagen que va dentro del círculo.
- `src/assets/audios/troia-1.aac` a `troia-4.aac` → las 4 líneas (teclas **1-4**; tocar la que ya suena la frena).
- `src/assets/audios/troia-5.aac` → suena cada vez que soltás algo en la zona de drag & drop.
- `src/assets/audios/troia-6.aac` → suena en el festejo final.
- `src/assets/audios/troia-7.aac` → suena en la alerta roja por inactividad. Diálogo sugerido:
  > "SI NO MOVÉS ALGÚN PERIFÉRICO ENVIARÉ AUTOMÁTICAMENTE EL ARCHIVO GENERADO POR TROIA (INC) POR MAIL, ASÍ CUMPLÍS CON EL DEADLINE."

## Secuencia completa
1. **Teclas 1-4**: reproducen/frenan cada línea de TROIA.
2. **Arrastrar y soltar** cualquier archivo sobre la página: va cargando, en orden, "DISEÑOS FACULTAD", "DISEÑOS 2024", "DISEÑOS CONCURSO" y "ultima-carta.jpg" (con `troia-5.aac` en cada una).
3. Con los 4 elementos cargados, **Enter** arranca la barra de progreso.
4. Al completarse, se abre una caja grande de "Procesando…" (~7-8 segundos) generando la imagen sin perder la esencia de Martín.
5. La caja se cierra sola y queda esperando un segundo **Enter** para revelar el aviso de que TROIA ya envió el archivo por mail (transición suave).
6. **Si pasan 5 minutos sin mover el mouse, tocar teclas ni hacer click** mientras espera ese Enter, salta automáticamente una alerta a pantalla completa en rojo: "ALERTA MARTÍN SON" / "23:50hs", con `troia-7.aac` sonando y una barra que se completa en ~4.5 segundos. Al terminar, la ventana se cierra sola y pasa directo al aviso de envío (TROIA lo mandó igual, sin esperar a Martín).
7. Un **Enter** más (sin ningún aviso en pantalla) dispara el festejo final: "FELICITACIONES MARTÍN, LO HICIMOS", confetti y `troia-6.aac`.

## Cómo funciona
- El fondo es un degradé gris futurista (blanco a negro) con luces suaves flotando de fondo.
- El círculo con la imagen queda prácticamente quieto (solo un pulso muy sutil de escala), y alrededor se dibuja en un `<canvas>` una onda circular gris de 48 barras que crecen y decrecen según el nivel de amplitud del audio (Web Audio API `AnalyserNode`), suavizadas frame a frame para que no salten bruscamente.
- Mientras suena una línea normal, el fondo pasa a un degradé azulado (`modo-azul`).
- Mientras suena la línea marcada como `final` (la de "extraordinario trabajo"), el fondo pasa a un degradé verdoso (`modo-verde`), marcando que salió bien.
- Al terminar el audio, la onda se desvanece suavemente y el fondo vuelve al degradé neutro.

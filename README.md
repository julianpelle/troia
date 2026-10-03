# TROIA - Angular 19

## Cómo correrlo
```bash
npm install
npm start
```
Abrí http://localhost:4200

## Archivos que tenés que agregar vos
- `src/assets/img.png` → la imagen que va dentro del círculo.
- `src/assets/audios/troia-1.aac` → "Tranquilo, Tincho. Me doy cuenta por tus pulsaciones que estás tenso. ¿Querés que probemos algo? Yo me encargo."
- `src/assets/audios/troia-2.aac` → "¿Seguís ahí Martín? Estoy esperando tus indicaciones para arrancar. En 4 segundos lo tenemos listo.."
- `src/assets/audios/troia-3.aac` → "Si querés lo hacemos… juntos."
- `src/assets/audios/troia-4.aac` → "¡Extraordinario trabajo, Martín! Quedamos fascinados. Es increíble cómo lograste mantener intacta tu esencia y ese trazo humano tan característico."
- `src/assets/audios/troia-5.aac` → suena cada vez que soltás algo en el drag & drop (no tiene línea fija del guion; usalo como una reacción corta de TROIA al recibir cada archivo).
- `src/assets/audios/troia-6.aac` → suena en el festejo final (tampoco viene del guion original; libre para vos).
- `src/assets/audios/troia-7.aac` → suena en la alerta roja por inactividad. Diálogo sugerido:
  > "SI NO MOVÉS ALGÚN PERIFÉRICO ENVIARÉ AUTOMÁTICAMENTE EL ARCHIVO GENERADO POR TROIA (INC) POR MAIL, ASÍ CUMPLÍS CON EL DEADLINE."

## Secuencia completa
1. **Teclas 1-4**: reproducen/frenan cada línea de TROIA.
2. **Arrastrar y soltar** cualquier archivo sobre la página: va cargando, en orden, "DISEÑOS FACULTAD", "DISEÑOS 2024", "DISEÑOS CONCURSO" y "ultima-carta.jpg" (con `troia-5.aac` en cada una).
3. Con los 4 elementos cargados, **Enter** arranca la barra de progreso.
4. Al completarse, se abre una caja grande de "Procesando…" durante 3 segundos, generando la imagen sin perder la esencia de Martín.
5. Esa caja cambia a una confirmación breve (~2.2s): "Archivo generado con éxito. Está guardado." con un tic verde chico.
6. Se cierra sola y queda esperando un segundo **Enter** para revelar el aviso de que TROIA ya envió el archivo por mail (transición suave).
7. **Si pasan 5 minutos sin mover el mouse, tocar teclas ni hacer click** mientras espera ese Enter, salta automáticamente una alerta a pantalla completa en rojo: "ALERTA MARTÍN SON" / "23:50hs", con `troia-7.aac` sonando y una barra que se completa en ~4.5 segundos. Al terminar, la ventana se cierra sola y pasa directo al aviso de envío (TROIA lo mandó igual, sin esperar a Martín).
8. Un **Enter** más (sin ningún aviso en pantalla) dispara el festejo final: "FELICITACIONES MARTÍN, LO HICIMOS", confetti y `troia-6.aac`.

## Cómo funciona
- El fondo es un degradé gris futurista (blanco a negro) con luces suaves flotando de fondo.
- El círculo con la imagen queda prácticamente quieto (solo un pulso muy sutil de escala), y alrededor se dibuja en un `<canvas>` una onda circular gris de 48 barras que crecen y decrecen según el nivel de amplitud del audio (Web Audio API `AnalyserNode`), suavizadas frame a frame para que no salten bruscamente.
- Mientras suena una línea normal, el fondo pasa a un degradé azulado (`modo-azul`).
- Mientras suena la línea marcada como `final` (la de "extraordinario trabajo"), el fondo pasa a un degradé verdoso (`modo-verde`), marcando que salió bien.
- Al terminar el audio, la onda se desvanece suavemente y el fondo vuelve al degradé neutro.

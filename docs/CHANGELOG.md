# Historial de cambios

## 2026-10-22 — Base documental

- Se añadió guía de continuidad en `AGENTS.md`.
- Se copió la especificación v2.0 completa a `docs/REQUIREMENTS.md`.
- Se registró el estado del workspace, decisiones iniciales, inventario real de medios y checklist por fases.
- No se implementó ni publicó la landing en esta sesión.

## 2026-10-22 — F1-03, base técnica

- Se creó el proyecto Astro 7 estático con TypeScript estricto, Tailwind 4, GSAP, Lenis, Sharp, Phosphor Icons y sitemap condicionado al dominio oficial.
- Se fijó pnpm 11.1.1, se generó el lockfile y se registró la aprobación del script de Sharp.
- Se añadió una página provisional `noindex`, sin datos del negocio por validar.
- Se verificaron instalación offline congelada, build y chequeo de Astro/TypeScript.
- Se documentaron los bloqueos observados de PowerShell, red y pnpm.
- Se fijó en `AGENTS.md` la instrucción del usuario de usar pnpm exclusivamente; `pnpm.cmd` es su lanzador compatible con PowerShell.

## 2026-10-22 — Preparación local para GitHub

- Se revisó el árbol de archivos y los 18 originales sin moverlos.
- Se añadió `README.md`, `.gitattributes` y exclusiones de archivos temporales de Windows/macOS.
- Se actualizó la guía permanente con el alcance de permisos indicado por el usuario.
- No se creó remoto, commit ni push.

## 2026-10-22 — F1-06, licencia y metadatos de video

- Se constató el commit inicial y `origin` configurados por el usuario; no se hicieron commits ni pushes en esta tarea.
- Se fijó el almacén de pnpm dentro del proyecto y se instaló `@ffprobe-installer/ffprobe` como dependencia de desarrollo.
- Se añadió `pnpm media:inspect` para examinar los cinco MP4 sin modificarlos.
- Se registró la ausencia de licencia escrita identificable en Arko y la aclaración posterior del usuario sobre el permiso verbal de Midudev para usar su implementación; no se trasladarán identidad ni medios de Arko.
- Se documentaron AV1, cuatro pistas AAC, keyframes escasos, color BT.709 y `faststart`.

## 2026-10-22 — F2-01, timeline determinista

- Se creó la configuración tipada de cinco segmentos y la función pura de posición global de scroll.
- Se añadieron pruebas de fronteras, límites, saltos, retroceso y configuración inválida con `pnpm test`.
- Se verificaron pruebas, chequeo de tipos y build estático.
- F1-06 quedó registrado en el commit local `b65daf3`; F2-01 no se ha enviado a GitHub.

## 2026-10-22 — F2-02, stage con videos

- Se hizo commit local de F2-01 como `b900594`, sin push.
- Se añadió el stage sticky con cinco videos, sincronización GSAP/ScrollTrigger y Lenis.
- Astro genera URL de los MP4 desde `assets/`; no se alteraron los originales.
- Se añadió salida accesible y vista estática para movimiento reducido o ahorro de datos.
- Chrome local verificó avance, retroceso y pausa de los cinco videos mediante `pnpm test:browser`.
- Se hizo que la prueba de navegador espere el stage tras reinicios de Vite; la repetición pasó.

## 2026-10-22 — F2-03, navegación del recorrido

- Se eliminó el padding global para que el video ocupe el ancho disponible completo en escritorio y móvil.
- Se añadieron saltos a las cinco paradas, estado accesible de parada actual y panel de depuración exclusivo de desarrollo.
- Los cambios rápidos de tramo vuelven al fondo de reserva mientras se prepara el nuevo video.
- Chrome local verificó saltos, scroll rápido, regreso, ancho completo, movimiento reducido y ausencia de errores de página.

## 2026-10-22 — F3-01, intervalos de parada

- Se registró el commit local de la fase 2 como `1476aab`, sin push.
- Se añadieron cinco paneles provisionales que aparecen en los intervalos de parada configurados y se ocultan durante cada video.
- Se expuso el ID y progreso de la parada en el stage y el panel de depuración.
- Pruebas verificaron longitudes configurables, ida y vuelta por las cinco paradas y fotograma estable durante una parada.

## 2026-10-22 — F3-02, fondos configurables por parada

- Se configuraron fotos WebP homónimas como fondo predeterminado de las paradas 1–4; la parada 5 termina con video congelado.
- Se extrajeron cuatro pósters livianos del último frame de sus videos sin modificar los originales.
- Se añadieron modos `video-freeze`, `poster-image` y `high-res-image`, con selector exclusivo de desarrollo.
- Las imágenes llenan el escenario manteniendo proporción en escritorio y móvil; se documentaron las diferencias de encuadre observadas para revisión posterior.

## 2026-10-22 — Corrección de secuencia audiovisual

- Las fotos aparecen antes de sus videos: 1→1, 2→2, 3→3 y `Parte_4.webp`→`Parte_5.mp4`.
- Se retiró `Parte_4.mp4` de la secuencia sin tocar su archivo original; no se renombró `Parte_4.webp`.
- Los cuatro pósters de comparación se regeneraron desde el primer fotograma de cada video activo.
- Se verificó visualmente la correspondencia de las cuatro fotos con los fotogramas iniciales y en Chrome el orden, los saltos, el regreso y el cierre.

## 2026-10-22 — Corrección del cuarto tramo y nombre de la foto

- Se restituyó `Parte_4.mp4` entre los videos 3 y 5; solo este tramo carece de foto y parada previa.
- Se renombró `assets/Parte_4.webp` a `assets/Parte_5.webp` y se actualizaron las referencias y pruebas.
- La navegación conserva cuatro botones de parada fotográfica para cinco videos. Chrome verificó el paso directo entre los videos 3 y 4 y la foto antes del video 5.

## 2026-10-22 — F3-03, precarga y continuidad visual

- Se preparan las imágenes mediante `decode()` y se cargan los videos vecinos al tramo activo.
- El fondo anterior sigue visible hasta que el siguiente fotograma o imagen está disponible; el fundido conserva una capa saliente.
- Una foto fallida utiliza su póster como respaldo. Chrome verificó video 3→4 retrasado, regreso sin fondo vacío y fallo de la foto 5.
- Pasaron `pnpm.cmd test` (6/6), `pnpm.cmd check` (0 diagnósticos), `pnpm.cmd build` (1 página) y `pnpm.cmd test:browser`.

## 2026-10-22 — F4-01, revisión de escenas y continuidad

- Se registró la fase 3 verificada en el commit local `e8b4356`, sin push ni inclusión de las eliminaciones anteriores de `assets/`.
- Se guardaron cinco láminas comparativas de videos y portadas en `docs/media-review/`.
- `docs/MEDIA.md` documenta los espacios observables, los cortes de perspectiva, la ausencia de fachada en estos clips y la transparencia de la imagen de Parte 2.
- Se mantuvo el orden audiovisual. Pasaron `pnpm.cmd test` (6/6), `pnpm.cmd check` (0 diagnósticos) y `pnpm.cmd build` (1 página).

## 2026-10-22 — Foto final Parte 6

- Se añadió `Parte_6.webp` como fondo de la parada posterior a `Parte_5.mp4`; los cinco videos mantienen su orden.
- La foto 5 pasa a ser la parada posterior al video 4, por lo que sigue apareciendo antes del video 5 sin poner foto al inicio del pasillo.
- Se generaron pósters desde los últimos frames de los videos 4 y 5, sin tocar los originales.
- Se comparó la foto 6 con el final del video 5 y se amplió la prueba de navegador para el cierre, sus modos de fondo y el fallo de la imagen.
- Pasaron `pnpm.cmd test` (6/6), `pnpm.cmd check` (0 diagnósticos), `pnpm.cmd build` (5 videos, 5 fotos y 5 pósters en una página) y `pnpm.cmd test:browser` (sin errores de página).

## 2026-10-22 — F4-02, medios del build estático

- Se creó el commit local `44b178f` con F4-01 y la foto final, sin push ni inclusión de las cuatro eliminaciones antiguas en `assets/`.
- Se añadió `pnpm.cmd test:production` para comprobar desde Astro Preview los 15 recursos publicados, sus tipos y su igualdad por SHA-256 con los archivos fuente.
- Chrome verificó los cinco videos, la foto final y el respaldo ante un MP4 fallido.
- Se corrigió el aviso cuando un video vecino falla durante su precarga antes de convertirse en el tramo activo.

## 2026-10-22 — F4-03, rendimiento del recorrido

- Se registró F4-02 en el commit local `97de235`, sin push ni las eliminaciones previas de `assets/`.
- Se añadieron auditorías repetibles de tiempos de seek, bytes de video, heap JavaScript y audio.
- Se difirió la asignación de `src` y la carga del siguiente video hasta pasar la mitad del tramo actual. La descarga inicial medida bajó a unos 3,0 MB.
- Una red simulada de 4 Mb/s mostró demoras de 1,5–9,2 s al entrar en tramos; se conserva este riesgo para pruebas de dispositivos y navegadores antes de considerar derivados de los MP4.

## 2026-10-22 — F5-01, prototipos de personajes

- Se registró la fase 4 verificada en el commit local `bdb24af`, sin push ni las cuatro eliminaciones previas de `assets/`.
- Se inspeccionaron los cuatro PNG y su transparencia; se asignaron como guías ilustrativas provisionales a las cinco paradas fotográficas.
- Se configuró un umbral editable del 35 % de scroll dentro de cada parada para apreciar primero la fotografía. La superposición visual se implementará en F5-02.

## 2026-10-23 — F5-02, personajes sobre fotografías

- Se registró F5-01 en el commit local `c9b200e`, sin push ni las cuatro eliminaciones anteriores de `assets/`.
- Los prototipos aparecen después del 35 % de scroll de su fotografía, con entrada y salida reversibles. Se cargan cerca del umbral y no bloquean controles.
- Se ajustó la posición móvil tras revisar capturas; el personaje deja libres la tarjeta superior y el bloque inferior.
- Se comprobaron los cuatro PNG publicados por hash, cinco paradas, regreso, movimiento reducido y fallo de un personaje con la foto aún visible.

## 2026-10-23 — F5-03, diálogos paginados

- Se registró F5-02 en el commit local `02bdd46`, sin push ni las cuatro eliminaciones antiguas de `assets/`.
- Cada parada muestra un diálogo de dos páginas después de apreciar la fotografía; los botones funcionan con mouse, teclado y tacto, y el scroll no cambia la página.
- El texto sigue disponible al regresar a una parada, si falla el avatar y en modo de movimiento reducido.
- Se prepararon enlaces opcionales de redes y consulta ReTHUS con filtros de confirmación y dominio oficial; los prototipos no publican ninguno.

## 2026-10-23 — F6-01, partículas opcionales

- Se registró F5-03 en el commit local `b884144`, sin push ni las cuatro eliminaciones antiguas de `assets/`.
- Se añadieron configuraciones tipadas de polvo, destellos y brillos suaves para las cinco paradas; la segunda queda desactivada.
- Un canvas decorativo aparece después del tramo inicial de fotografía y no intercepta controles. Se oculta con movimiento reducido.
- Se verificaron los efectos en Chrome y se inspeccionaron capturas temporales de recepción y sala clínica.

## 2026-10-23 — Configuración provisional de GitHub Pages

- Se añadió un workflow para verificar y desplegar el build estático al subir cambios a `main`.
- El build de Pages usa la ruta `/sonrie-web` y omite el sitemap mientras la página provisional mantenga `noindex`.
- No se subieron cambios ni se activó Pages desde este workspace.

## 2026-10-23 — Corrección de instalación en GitHub Actions

- Se autorizó en pnpm el script de `@ffprobe-installer/linux-x64`, requerido por la dependencia de desarrollo de ffprobe en el runner Linux.
- La instalación local con lockfile congelado, el chequeo de Astro y las 11 pruebas pasaron; queda pendiente repetir el workflow remoto.

## 2026-10-23 — Compatibilidad con Node 24

- Se alineó el workflow con Node LTS 24 y el mínimo declarado del proyecto con Astro 7.4.2 (`>=22.23.4`).
- El lockfile y las versiones de librerías permanecen iguales; instalación, chequeo, 11 pruebas y build de Pages pasaron con Node 24.13.1 local.

## 2026-10-23 — F6-02, círculos luminosos compartidos

- Se reemplazaron los efectos distintos por parada por un ciclo común de círculos que nacen, brillan suavemente y desaparecen.
- Se detiene el dibujo fuera de la parada, del viewport o con la página oculta; ahorro de datos y movimiento reducido lo desactivan.
- En equipos modestos se limita a seis partículas y 20 FPS. Se verificaron pruebas unitarias, Astro Check, build, Chrome y capturas visuales.

## 2026-10-23 — Auditoría inicial de rendimiento móvil y longitud del recorrido

- Se priorizó F9-00 por los reportes de iPhone sin animación fluida y de navegación excesivamente larga en escritorio.
- La inspección confirmó cinco MP4 AV1 a 1080p con fotogramas clave escasos y un recorrido de 27,5 alturas de pantalla. Falta validar en Safari de un iPhone real antes de elegir e implementar la solución.
- Solo se actualizó documentación; no se cambiaron videos ni comportamiento de la página.

## 2026-10-23 — Variante móvil de video y scroll

- Se añadieron derivados H.264 verticales de 480×1040 y horizontales de 1280×720, sin audio y con keyframes cada 0,5 s; los originales AV1 de escritorio no cambiaron.
- En móvil, el scroll asignado a video bajó de 4 a 2,5 alturas por tramo; la duración de lectura de las cinco paradas sigue en 1,5 alturas.
- El navegador elige el video según tamaño/tacto y orientación y actualiza la fuente al girar. Chrome local comprobó avance y regreso de los cinco tramos, giro y ausencia de solicitudes AV1 en vertical. Falta prueba en los teléfonos físicos reportados.

## 2026-10-23 — Instalación de FFmpeg en GitHub Actions

- La primera ejecución tras el push falló al instalar: pnpm bloqueó el script de `@ffmpeg-installer/linux-x64@4.1.0`.
- Se autorizó ese binario de desarrollo en `pnpm-workspace.yaml`.
- La siguiente ejecución de GitHub Actions pasó instalación, chequeo, pruebas, build y deploy. La URL pública respondió HTTP 200 y el recorrido móvil publicado pasó la prueba automatizada de Chrome.

## 2026-10-23 — Barra vertical para navegar el recorrido

- Los números 01–05 quedaron sobre una línea proporcional al recorrido, con tramo iluminado e indicador de posición.
- Ahora se puede tocar, hacer clic o arrastrar entre marcas para ir a un punto intermedio; también funciona con flechas, Page Up/Down, Home y End.
- Las pruebas de Chrome cubrieron escritorio, tacto móvil, regreso, botones y movimiento reducido; las capturas de dispositivos reales siguen pendientes de revisión.

## 2026-10-23 — Indicador de la barra más legible

- El punto verde se sustituyó por una línea horizontal blanca que cruza el riel y señala el progreso, con borde oscuro para distinguirla sobre fondos claros.
- Se reforzó el contraste del riel y se conservó la navegación continua y los botones 01–05.
- La apariencia se revisó en capturas locales de escritorio y móvil; falta comprobarla en los teléfonos físicos reportados.

## 2026-10-23 — Navegación con apariencia de tira de película

- Se sustituyeron los botones circulares por marcas rectangulares y se usó una paleta neutra de marfil y gris carbón.
- Una columna oscura translúcida mantiene legibles el riel, el progreso y los números sobre los fotogramas.
- El comportamiento del control y sus saltos se conservaron; falta opinión visual en los teléfonos físicos.

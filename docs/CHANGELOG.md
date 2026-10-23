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

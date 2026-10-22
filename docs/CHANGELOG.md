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

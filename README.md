# Sonríe Urrao

Landing estática en preparación para Sonríe Urrao. El recorrido provisional muestra cinco videos en orden, controlados por scroll. Las fotos 1, 2 y 3 abren sus videos; el video 4 comienza sin foto, la foto 5 aparece antes del video 5 y la foto 6 cierra el recorrido. En desarrollo, cada parada permite comparar la foto, un póster del fotograma contiguo y el video congelado. Los contenidos comerciales siguen pendientes. La página provisional lleva `noindex`.

## Requisitos

- Node.js 22.23.4 o superior; GitHub Actions usa la rama LTS 24.
- pnpm 11.1.1, fijado en `package.json`.

## Desarrollo local

Desde la raíz del repositorio:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm media:inspect
pnpm media:mobile
pnpm test
```

En PowerShell de este equipo, usa `pnpm.cmd` en lugar de `pnpm` para evitar el bloqueo de `pnpm.ps1` por la política de scripts. Ambos invocan pnpm. En CMD se puede usar `pnpm`.

Para probar el recorrido en Chrome local, inicia `pnpm dev` y ejecuta `pnpm test:browser` en otra terminal. Esta prueba usa la instalación local de Chrome; los navegadores adicionales se revisarán en F9-01.

La barra vertical derecha muestra el progreso global y permite navegar entre los botones 01–05 con mouse, tacto o teclado. Con Dev o Preview activo, `pnpm.cmd test:navigation` comprueba el riel y los saltos en Chrome de escritorio y móvil emulado.

`pnpm media:mobile` regenera los derivados H.264 en `src/media/mobile/` desde los originales de `assets/`. El sitio usa 480×1040 en móvil vertical y 1280×720 al girar; escritorio conserva sus MP4 AV1 y su distancia de scroll. Con Dev o Preview activo en el puerto 4321, `pnpm.cmd exec node tests/mobile-performance-browser.mjs` comprueba selección de archivos, cinco tramos, regreso y giro en Chrome emulado. La comprobación final requiere los teléfonos físicos.

Para comprobar los medios publicados por el build estático, ejecuta `pnpm build`, inicia `pnpm preview --host 127.0.0.1 --port 4321` y en otra terminal ejecuta `pnpm test:production`. La prueba compara por SHA-256 los cinco MP4, las cinco fotos WebP y los cinco pósters servidos con sus archivos fuente; también recorre los cinco videos y comprueba el respaldo al fallar uno. En PowerShell usa `pnpm.cmd` para cada comando. Si usas otra dirección para la vista previa, configura `SONRIE_PREVIEW_URL`.

Para repetir la auditoría de F4-03 con Preview activo, ejecuta `pnpm.cmd exec node scripts/audit-video-performance.mjs` y `pnpm.cmd exec node scripts/audit-video-audio.mjs`. La primera admite `SONRIE_AUDIT_SLOW=1` para simular 4 Mb/s y 150 ms; las cifras dependen del equipo y no representan todos los navegadores. Los MP4 se asignan al elemento de video cuando se necesitan, y el siguiente se carga al superar la mitad del tramo.

Los diálogos de demostración están en `src/data/dialogues.ts`. Con Preview activo, `pnpm.cmd exec node tests/dialogue-browser.mjs` comprueba páginas, teclado, tacto, regreso y movimiento reducido. Cada acción externa requiere una persona real identificada y un enlace confirmado; los personajes actuales son prototipos y no muestran botones de redes ni acreditación. La consulta pública ReTHUS se documenta en `docs/DECISIONS.md`.

Las cinco paradas fotográficas reutilizan el mismo efecto de círculos luminosos, configurado en `src/data/particles.ts`. Los círculos aparecen y se desvanecen en ciclos después del momento inicial reservado para la foto. El dibujo se pausa al salir de la parada o al ocultar la página; se desactiva con movimiento reducido o ahorro de datos y usa menos partículas en equipos modestos. Con Preview activo, `pnpm.cmd exec node tests/particles-browser.mjs` comprueba estos estados.

## Organización

- `assets/`: medios originales; conservar sin sobrescribir.
- `src/data/media.ts`: importa por URL los originales, las variantes móviles y los pósters derivados. Astro emite rutas versionadas en `dist/_astro/`; no es necesario duplicar los originales en `public/`.
- `src/`: aplicación Astro.
- `docs/REQUIREMENTS.md`: copia de trabajo de la especificación original `start.txt`.
- `docs/PROGRESS.md`: tareas, estado y verificaciones.
- `docs/DECISIONS.md` y `docs/MEDIA.md`: decisiones técnicas e inventario audiovisual.

`node_modules/`, `dist/`, `.astro/`, `.pnpm-store/` y archivos `.env` se excluyen de Git. El sitemap se activa cuando se configure `PUBLIC_SITE_URL` con un dominio confirmado; `PUBLIC_SITEMAP=false` lo desactiva durante la publicación del prototipo. Consulta `.env.example`.

## Despliegue provisional en GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` ejecuta `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test` y `pnpm build` cuando se suben cambios a `main`. Si pasan, publica `dist/` en GitHub Pages. También se puede iniciar manualmente desde Actions. La URL prevista es `https://eriold.github.io/sonrie-web/`; el build usa `/sonrie-web` como ruta base para videos, fotos, estilos y scripts.

Para activar el primer despliegue, en el repositorio de GitHub selecciona **Settings → Pages → Build and deployment → Source → GitHub Actions** y sube este workflow a `main`. No se requieren secretos para GitHub Pages. La página actual es un prototipo público con personajes de muestra, textos sin validar y `noindex`; el workflow no genera sitemap. Antes de publicar el sitio comercial se deben completar las fases de contenido, validación y SEO. Si se asigna un dominio propio, actualiza `PUBLIC_SITE_URL` y elimina `PUBLIC_BASE_PATH` del workflow, además de configurar el dominio en Pages.

Todavía no se ha ejecutado ningún despliegue desde este repositorio de trabajo.

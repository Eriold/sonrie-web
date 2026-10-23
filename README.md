# Sonríe Urrao

Landing estática en preparación para Sonríe Urrao. El recorrido provisional muestra cinco videos en orden, controlados por scroll. Las fotos 1, 2 y 3 abren sus videos; el video 4 comienza sin foto, la foto 5 aparece antes del video 5 y la foto 6 cierra el recorrido. En desarrollo, cada parada permite comparar la foto, un póster del fotograma contiguo y el video congelado. Los contenidos comerciales siguen pendientes. La página provisional lleva `noindex`.

## Requisitos

- Node.js 22.22.0 o superior.
- pnpm 11.1.1, fijado en `package.json`.

## Desarrollo local

Desde la raíz del repositorio:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm build
pnpm media:inspect
pnpm test
```

En PowerShell de este equipo, usa `pnpm.cmd` en lugar de `pnpm` para evitar el bloqueo de `pnpm.ps1` por la política de scripts. Ambos invocan pnpm. En CMD se puede usar `pnpm`.

Para probar el recorrido en Chrome local, inicia `pnpm dev` y ejecuta `pnpm test:browser` en otra terminal. Esta prueba usa la instalación local de Chrome; los navegadores adicionales se revisarán en F9-01.

Para comprobar los medios publicados por el build estático, ejecuta `pnpm build`, inicia `pnpm preview --host 127.0.0.1 --port 4321` y en otra terminal ejecuta `pnpm test:production`. La prueba compara por SHA-256 los cinco MP4, las cinco fotos WebP y los cinco pósters servidos con sus archivos fuente; también recorre los cinco videos y comprueba el respaldo al fallar uno. En PowerShell usa `pnpm.cmd` para cada comando. Si usas otra dirección para la vista previa, configura `SONRIE_PREVIEW_URL`.

Para repetir la auditoría de F4-03 con Preview activo, ejecuta `pnpm.cmd exec node scripts/audit-video-performance.mjs` y `pnpm.cmd exec node scripts/audit-video-audio.mjs`. La primera admite `SONRIE_AUDIT_SLOW=1` para simular 4 Mb/s y 150 ms; las cifras dependen del equipo y no representan todos los navegadores. Los MP4 se asignan al elemento de video cuando se necesitan, y el siguiente se carga al superar la mitad del tramo.

Los diálogos de demostración están en `src/data/dialogues.ts`. Con Preview activo, `pnpm.cmd exec node tests/dialogue-browser.mjs` comprueba páginas, teclado, tacto, regreso y movimiento reducido. Cada acción externa requiere una persona real identificada y un enlace confirmado; los personajes actuales son prototipos y no muestran botones de redes ni acreditación. La consulta pública ReTHUS se documenta en `docs/DECISIONS.md`.

Los efectos ambientales se configuran por parada en `src/data/particles.ts`. Con Preview activo, `pnpm.cmd exec node tests/particles-browser.mjs` verifica su aparición tras la foto, las paradas desactivadas, el orden de capas y movimiento reducido. F6-02 ampliará las medidas de rendimiento.

## Organización

- `assets/`: medios originales; conservar sin sobrescribir.
- `src/data/media.ts`: importa por URL los originales y los pósters derivados. Astro emite rutas versionadas en `dist/_astro/`; no es necesario duplicar los originales en `public/`.
- `src/`: aplicación Astro.
- `docs/REQUIREMENTS.md`: copia de trabajo de la especificación original `start.txt`.
- `docs/PROGRESS.md`: tareas, estado y verificaciones.
- `docs/DECISIONS.md` y `docs/MEDIA.md`: decisiones técnicas e inventario audiovisual.

`node_modules/`, `dist/`, `.astro/`, `.pnpm-store/` y archivos `.env` se excluyen de Git. El sitemap se activa cuando se configure `PUBLIC_SITE_URL` con un dominio confirmado; `PUBLIC_SITEMAP=false` lo desactiva durante la publicación del prototipo. Consulta `.env.example`.

## Despliegue provisional en GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` ejecuta `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test` y `pnpm build` cuando se suben cambios a `main`. Si pasan, publica `dist/` en GitHub Pages. También se puede iniciar manualmente desde Actions. La URL prevista es `https://eriold.github.io/sonrie-web/`; el build usa `/sonrie-web` como ruta base para videos, fotos, estilos y scripts.

Para activar el primer despliegue, en el repositorio de GitHub selecciona **Settings → Pages → Build and deployment → Source → GitHub Actions** y sube este workflow a `main`. No se requieren secretos para GitHub Pages. La página actual es un prototipo público con personajes de muestra, textos sin validar y `noindex`; el workflow no genera sitemap. Antes de publicar el sitio comercial se deben completar las fases de contenido, validación y SEO. Si se asigna un dominio propio, actualiza `PUBLIC_SITE_URL` y elimina `PUBLIC_BASE_PATH` del workflow, además de configurar el dominio en Pages.

Todavía no se ha ejecutado ningún despliegue desde este repositorio de trabajo.

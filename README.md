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

## Organización

- `assets/`: medios originales; conservar sin sobrescribir.
- `src/data/media.ts`: importa por URL los originales y los pósters derivados. Astro emite rutas versionadas en `dist/_astro/`; no es necesario duplicar los originales en `public/`.
- `src/`: aplicación Astro.
- `docs/REQUIREMENTS.md`: copia de trabajo de la especificación original `start.txt`.
- `docs/PROGRESS.md`: tareas, estado y verificaciones.
- `docs/DECISIONS.md` y `docs/MEDIA.md`: decisiones técnicas e inventario audiovisual.

`node_modules/`, `dist/`, `.astro/`, `.pnpm-store/` y archivos `.env` se excluyen de Git. El sitemap se activa cuando se configure `PUBLIC_SITE_URL` con un dominio confirmado; consulta `.env.example`.

No hay despliegue ni contenido comercial validado todavía.

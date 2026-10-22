# Sonríe Urrao

Landing estática en preparación para Sonríe Urrao. El recorrido provisional muestra los cinco videos en orden, controlados por scroll. Hay una foto antes de los videos 1, 2, 3 y 5; el video 4 continúa directamente desde el 3, sin foto previa. `Parte_5.webp` abre el video 5. Cada portada permite comparar en desarrollo la foto, un póster del primer fotograma y el video congelado. Los contenidos comerciales siguen pendientes. La página provisional lleva `noindex`.

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

## Organización

- `assets/`: medios originales; conservar sin sobrescribir.
- `src/`: aplicación Astro.
- `docs/REQUIREMENTS.md`: copia de trabajo de la especificación original `start.txt`.
- `docs/PROGRESS.md`: tareas, estado y verificaciones.
- `docs/DECISIONS.md` y `docs/MEDIA.md`: decisiones técnicas e inventario audiovisual.

`node_modules/`, `dist/`, `.astro/`, `.pnpm-store/` y archivos `.env` se excluyen de Git. El sitemap se activa cuando se configure `PUBLIC_SITE_URL` con un dominio confirmado; consulta `.env.example`.

No hay despliegue ni contenido comercial validado todavía.

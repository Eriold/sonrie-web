# Sonríe Urrao

Landing estática en preparación para Sonríe Urrao. Actualmente existe la base técnica; el recorrido, los contenidos comerciales y la revisión de los medios siguen pendientes. La página provisional lleva `noindex`.

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
```

En PowerShell de este equipo, usa `pnpm.cmd` en lugar de `pnpm` para evitar el bloqueo de `pnpm.ps1` por la política de scripts. Ambos invocan pnpm. En CMD se puede usar `pnpm`.

## Organización

- `assets/`: medios originales; conservar sin sobrescribir.
- `src/`: aplicación Astro.
- `docs/REQUIREMENTS.md`: copia de trabajo de la especificación original `start.txt`.
- `docs/PROGRESS.md`: tareas, estado y verificaciones.
- `docs/DECISIONS.md` y `docs/MEDIA.md`: decisiones técnicas e inventario audiovisual.

`node_modules/`, `dist/`, `.astro/`, `.pnpm-store/` y archivos `.env` se excluyen de Git. El sitemap se activa cuando se configure `PUBLIC_SITE_URL` con un dominio confirmado; consulta `.env.example`.

No hay despliegue ni contenido comercial validado todavía.

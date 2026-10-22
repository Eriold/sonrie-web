# Guía permanente — Sonríe Urrao

Trabaja y responde siempre en español. Lee `start.txt` como especificación fuente y `docs/REQUIREMENTS.md` como su copia de trabajo. Consulta `docs/PROGRESS.md` para conocer la siguiente tarea: la base Astro ya existe y su estado se verifica allí.

## Al iniciar una sesión

1. Lee este archivo, `docs/REQUIREMENTS.md`, `docs/PROGRESS.md`, `docs/DECISIONS.md` y `docs/MEDIA.md`.
2. Comprueba los archivos reales, el estado de Git y las herramientas disponibles. Si la documentación difiere del repositorio, registra la diferencia antes de actuar.
3. Toma la primera tarea `PENDING` sin dependencias, salvo que el usuario cambie la prioridad.
4. Consulta la referencia técnica enlazada en `docs/DECISIONS.md` antes de implementar el motor de recorrido. Comprueba permisos antes de reutilizar código o recursos.

## Reglas de implementación

- Stack previsto: Astro 7, TypeScript estricto, Tailwind CSS 4, GSAP/ScrollTrigger, Lenis, Sharp, Phosphor Icons, sitemap y pnpm. Sitio estático. Evita React salvo necesidad demostrada.
- Usa exclusivamente pnpm para instalar dependencias y ejecutar scripts del proyecto. En PowerShell invoca `pnpm.cmd` si la política de ejecución bloquea `pnpm.ps1`; en CMD puedes invocar `pnpm` directamente. No uses npm ni yarn como gestores del proyecto.
- Separa contenido, configuración de paradas, medios y lógica del scroll. El tiempo del video depende del scroll y debe ser reversible.
- Conserva los originales en `assets/`. No inventes datos del negocio, servicios, profesionales, horarios, contacto, credenciales, reseñas ni contenido clínico definitivo. Lo no confirmado queda marcado para validación y fuera de producción.
- No publiques ni despliegues sin autorización. Al empezar una fase nueva, haz un commit local de la fase anterior una vez verificada; no hagas pushes automáticos.
- Puedes actuar dentro de esta carpeta para este proyecto. Consulta primero al usuario antes de modificar el sistema operativo, trabajar fuera de esta carpeta o crear/cambiar recursos externos en GitHub.
- Mantén accesibles la navegación y el contenido comercial si fallan los videos o se reduce el movimiento.

## Al cerrar una tarea

1. Ejecuta las verificaciones propias de la tarea y anota resultados reales. No marques `COMPLETED` por intención.
2. Actualiza `docs/PROGRESS.md`; si procede, `docs/DECISIONS.md`, `docs/MEDIA.md`, `docs/REQUIREMENTS.md` y `docs/CHANGELOG.md`.
3. Informa qué cambió, qué se probó, qué falta y cuál es la siguiente tarea.

Estados: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `BLOCKED`, `NEEDS_REVIEW`.

# Decisiones y supuestos

## D-001 — Memoria antes de la aplicación (2026-10-22)

La petición actual solicita revisar la especificación y los recursos para dejar una base recuperable por checklist. Por ello esta sesión crea la documentación persistente e inventaría los medios; la creación de Astro y el motor de scroll permanecen pendientes. `start.txt` conserva todos los requisitos y se copia íntegro en `REQUIREMENTS.md`. No se interpreta la ausencia de código como una fase de implementación terminada.

## D-002 — Fuente de verdad y cambios (2026-10-22)

`start.txt` es la especificación maestra v2.0 recibida. `REQUIREMENTS.md` es la copia operativa inicial, sin recortes. Las solicitudes posteriores deben registrarse allí y en este archivo cuando cambien decisiones. `PROGRESS.md` describe el estado observado, no el deseado.

## D-003 — Recursos originales (2026-10-22)

`assets/` conserva los originales. Durante la implementación podrán copiarse u optimizarse hacia rutas de publicación, sin mover ni sobrescribir originales. Los nombres `Parte_N` no prueban que una foto coincida con el final de un video ni que los clips sigan el recorrido narrativo imaginado. Esa asignación requiere revisión visual.

## D-004 — Referencia Arko (2026-10-22)

Referencia: [repositorio de Midudev](https://github.com/midudev/mcp-higgsfield-landing) y [demo](https://arko-sushi.midudev.workers.dev/). Se consultaron `package.json`, `README.md`, `PROMPTS.md`, `world.ts`, `motion.ts`, `ScrollWorld.astro`, `Stop.astro` y `arko.ts`. Su motor interpola la posición de scroll, asigna `currentTime`, usa pósters bajo los videos, carga clips por cercanía y contempla movimiento reducido, ahorro de datos e iOS. Sonríe necesita además una fase de parada **después** de cada video, con permanencia y modos de fondo configurables; por tanto el timeline de Arko no se puede trasladar tal cual. Se usará como referencia de comportamiento, sujeto a revisión de licencia antes de reutilizar código. No se identificó una licencia aplicable en la consulta inicial: tratar la reutilización literal como pendiente.

## D-005 — Estado técnico inicial (2026-10-22)

La carpeta contenía únicamente `start.txt` y `assets/`; no existían `.git`, `package.json` ni aplicación. Node 24.13.1 está disponible. `pnpm.ps1` está bloqueado por la política de ejecución de PowerShell; al configurar el proyecto se puede usar `pnpm.cmd`. `ffprobe` y `ffmpeg` no estaban disponibles en PATH. La inspección de video se hizo con OpenCV y no permite dar por comprobados códec, audio, GOP ni `faststart`.

## D-006 — Base Astro y comandos en Windows (2026-10-22)

El estado de Git cambió desde D-005: ahora existe `.git`, con rama `master` sin commits y archivos sin seguimiento. Se creó Astro 7.4.2 estático con TypeScript estricto, Tailwind 4 mediante `@tailwindcss/vite`, GSAP, Lenis, Sharp, Phosphor Icons y `@astrojs/sitemap`. Se fijó `pnpm@11.1.1` y se generó `pnpm-lock.yaml`. La integración del sitemap se activa solo con `PUBLIC_SITE_URL` confirmado, para evitar publicar URLs inventadas. La única página actual es un marcador provisional con `noindex` y sin datos comerciales no validados.

En PowerShell, `pnpm` resuelve a `pnpm.ps1` y falla por `PSSecurityException`; usar `pnpm.cmd` (o el ejecutable `.cmd` desde CMD) sin modificar la política del sistema. El primer `pnpm.cmd install` recibió `EACCES` al acceder a npm por restricciones de red del entorno; con acceso autorizado descargó los paquetes. pnpm 11 rechazó el script de Sharp hasta ejecutar `pnpm.cmd approve-builds sharp`, que dejó `allowBuilds.sharp: true` en `pnpm-workspace.yaml`. Ejecutar instalación y verificaciones secuencialmente evita reconstrucciones concurrentes de `node_modules`.

El usuario confirmó que pnpm es el único gestor permitido en todo el proyecto. `pnpm.cmd` es el lanzador de pnpm en Windows, por lo que cumple esta regla. No instalar dependencias ni ejecutar scripts del proyecto con npm o yarn.

## D-007 — Preparación para GitHub (2026-10-22)

La estructura existente permite iniciar el historial sin mover medios: 18 originales en `assets/` suman 37.565.174 bytes; el mayor mide 9.509.249 bytes. Se conservan en Git ordinario por ahora; no se configura Git LFS para este tamaño inicial. `node_modules/`, `.pnpm-store/`, `dist/`, `.astro/` y archivos de entorno reales están excluidos. Se agregaron reglas de atributos para texto y binarios, y un README de arranque. El repositorio local está en `master`, sin commits ni remoto; la integración de GitHub consultada no mostró repositorios del usuario disponibles. Enlazar o crear el repositorio remoto requiere que el usuario indique el destino y autorice esa acción externa. No se hicieron commits ni pushes.

## D-008 — GitHub y ruta del almacén de pnpm (2026-10-22)

El usuario creó el commit inicial `8de4993` (`landing`), cambió la rama a `main` y configuró `origin` como `https://github.com/Eriold/sonrie-web.git`. Este estado sustituye la descripción anterior sin remoto. Al continuar F1-06, pnpm detectó que `node_modules` estaba enlazado a `D:\.pnpm-store\v11`, fuera de la carpeta autorizada, mientras la sesión usaba `.pnpm-store` dentro del proyecto. Se fijó `storeDir: .pnpm-store` en `pnpm-workspace.yaml`, se reconstruyó únicamente `node_modules` del proyecto y se verificó en `node_modules/.modules.yaml` la nueva ruta local. No se cambió la configuración del sistema ni se hizo commit o push.

## D-009 — Licencia de referencia y codificación de originales (2026-10-22)

El repositorio público [Arko de Midudev](https://github.com/midudev/mcp-higgsfield-landing) no muestra licencia y las rutas `LICENSE` y `LICENSE.md` devolvieron 404. No se encontró una concesión escrita de reutilización en su README. Posteriormente, el usuario informó que Midudev dio permiso en su canal de YouTube para usar libremente la implementación explicada allí. Se acepta esa información para adaptar el patrón técnico al recorrido de Sonríe; no se trasladarán identidad, textos ni medios de Arko. El alcance exacto de la declaración oral no se ha comprobado con un enlace al video. La [guía de GitHub sobre licencias](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) explica que publicar un repositorio sin licencia no concede automáticamente derechos de reutilización.

`ffprobe` confirmó que los cinco MP4 originales usan AV1 Main a 1920×1080, 24 FPS, y que 4 de ellos contienen pista AAC. La ausencia de pista de audio que indicaba `start.txt` no corresponde a los archivos reales; el audio debe silenciarse en la interfaz y verificarse si contiene señal perceptible. Hay pocos keyframes (solo el inicial en tres clips y separación de 161 frames en los otros dos), por lo que el seek puede requerir decodificación larga. Todos tienen etiquetas BT.709 y átomo `moov` antes de `mdat`. No se alteraron los originales ni se decidió recodificar sin una prueba real de scrubbing.

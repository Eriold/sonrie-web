# Estado y checklist — Sonríe Urrao

**Actualizado:** 2026-10-22. **Estado global:** stage sticky de ancho completo con cinco videos, saltos a paradas y control reversible comprobados en Chrome; fondos de paradas y contenido comercial pendientes. **Siguiente tarea técnica:** F3-01. Estados válidos: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `BLOCKED`, `NEEDS_REVIEW`. Solo usar `COMPLETED` tras comprobar el criterio de aceptación.

La [especificación completa](REQUIREMENTS.md) rige cada tarea. Los IDs permiten retomar trabajo y registrar pruebas. En las tablas, la columna **Resultado** resume la verificación o el motivo pendiente. Al ejecutar cada tarea, agregar debajo de su fase cualquier observación, comando y archivos concretos afectados.

## Fase 1 — Preparación y base técnica

| ID | Estado | Tarea y criterio de aceptación | Archivos previstos | Depende de | Resultado |
| --- | --- | --- | --- | --- | --- |
| F1-01 | COMPLETED | Revisar estado real del workspace: registrar archivos, Git y herramientas. | `docs/DECISIONS.md` | — | Solo `start.txt` y `assets/` al inicio; sin Git ni aplicación; Node 24.13.1 disponible. |
| F1-02 | COMPLETED | Consultar referencia Arko y señalar diferencias de arquitectura. | `docs/DECISIONS.md` | — | Se revisaron README, prompts, stack, motor, movimiento, componentes y datos; falta confirmar licencia antes de reutilizar código. |
| F1-03 | COMPLETED | Crear proyecto Astro 7 estático con TypeScript, Tailwind 4, GSAP, Lenis, Sharp, Phosphor y sitemap; fijar pnpm y lockfile. `pnpm.cmd build` debe terminar sin errores. | `package.json`, `pnpm-lock.yaml`, `astro.config.mjs`, `tsconfig.json`, `src/` | F1-01 | Astro 7.4.2, pnpm 11.1.1; build estático correcto, `astro check` sin diagnósticos e instalación offline con lockfile congelado correcta. Sitemap condicionado a dominio confirmado. |
| F1-04 | COMPLETED | Crear memoria completa y checklist; `REQUIREMENTS.md` debe conservar íntegro `start.txt`. | `AGENTS.md`, `docs/*.md` | F1-01 | Archivos creados; SHA-256 de `start.txt` y `docs/REQUIREMENTS.md` idénticos en la revisión de F1-06. |
| F1-05 | COMPLETED | Registrar todos los archivos reales con tamaño y dimensiones/duración básica; señalar medios ausentes. | `docs/MEDIA.md` | F1-01 | 5 videos, 9 fotos y 4 personajes registrados con Pillow/OpenCV. |
| F1-06 | COMPLETED | Inspeccionar licencia de referencia y completar metadatos técnicos con herramienta de video. | `docs/DECISIONS.md`, `docs/MEDIA.md` | F1-02, F1-05 | Arko sin licencia escrita identificada; el usuario informó permiso verbal de Midudev para usar la implementación. `pnpm.cmd media:inspect` confirmó AV1, 4 pistas AAC, keyframes escasos, BT.709 y `faststart`; seek real pendiente de F4-03. |
| F1-07 | COMPLETED | Preparar estructura local para GitHub sin alterar originales; comprobar exclusiones y tamaños. | `README.md`, `.gitignore`, `.gitattributes`, `docs/` | F1-03, F1-05 | Los 18 medios suman 37.565.174 bytes; originales intactos; generados y cachés ignorados. Sin remoto, commits ni push. |

## Fase 2 — Motor de recorrido

| ID | Estado | Tarea y criterio de aceptación | Archivos previstos | Depende de | Resultado |
| --- | --- | --- | --- | --- | --- |
| F2-01 | COMPLETED | Definir `tour.ts` tipado y función pura que traduzca scroll a segmento, fase, progreso de video y parada; cubrir límites y retroceso. | `src/data/tour.ts`, `src/scripts/timeline.ts`, pruebas | F1-03 | Cinco segmentos configurables; 4 pruebas cubren fases, fronteras, límites, saltos, retroceso y configuración inválida. `pnpm.cmd check` y `pnpm.cmd build` correctos. |
| F2-02 | COMPLETED | Crear stage sticky, ScrollTrigger y Lenis sincronizados; cinco clips responden al scroll en ambos sentidos y se detienen con él. | `src/components/ScrollWorld.astro`, `src/scripts/world.ts`, `src/scripts/motion.ts` | F2-01 | Chrome local: los 5 MP4 respondieron al scroll, permanecieron pausados y el primer clip volvió al mismo tiempo tras retroceder. Modo de movimiento reducido y enlace de salida verificados. `pnpm.cmd check` y build correctos. |
| F2-03 | COMPLETED | Soportar saltos a paradas, scroll rápido, regreso y panel de depuración solo en desarrollo. | componentes/scripts del recorrido | F2-02 | Cinco botones permiten saltar a las paradas. Chrome verificó salto a la 5, regreso a la 2, scroll rápido hasta la 1 y retroceso al mismo tiempo de video. Panel presente en desarrollo y ausente del HTML de producción. |

## Fase 3 — Paradas y transiciones

| ID | Estado | Tarea y criterio de aceptación | Archivos previstos | Depende de | Resultado |
| --- | --- | --- | --- | --- | --- |
| F3-01 | PENDING | Intercalar cinco intervalos de parada configurables después de cada video, con recorrido reversible. | `src/data/tour.ts`, `src/scripts/timeline.ts`, componentes | F2-02 | Pendiente. |
| F3-02 | PENDING | Implementar `video-freeze`, `poster-image` y `high-res-image` por parada, con selector comparativo en desarrollo. | componentes de fondo, datos | F3-01 | Pendiente. |
| F3-03 | PENDING | Precargar antes de cambiar capas y mantener fallback visual ante fallos; comprobar ausencia de flashes en ida y vuelta. | componentes/scripts de fondo | F3-02 | Pendiente. |

## Fase 4 — Integración audiovisual

| ID | Estado | Tarea y criterio de aceptación | Archivos previstos | Depende de | Resultado |
| --- | --- | --- | --- | --- | --- |
| F4-01 | PENDING | Comparar frames y fotos, asignar espacios y continuidad; documentar discrepancias sin inventar relación. | `docs/MEDIA.md`, `src/data/tour.ts` | F1-05 | Pendiente. |
| F4-02 | PENDING | Incorporar medios preservando originales; generar pósters necesarios y verificar carga de los cinco clips. | `public/video/`, imágenes publicadas, `docs/MEDIA.md` | F3-02, F4-01 | Pendiente. |
| F4-03 | PENDING | Medir seek, GOP, memoria y red; optimizar sin recodificación innecesaria. | cargador de videos, `docs/MEDIA.md` | F4-02 | Pendiente. |

## Fase 5 — Personajes y diálogos

| ID | Estado | Tarea y criterio de aceptación | Archivos previstos | Depende de | Resultado |
| --- | --- | --- | --- | --- | --- |
| F5-01 | PENDING | Inspeccionar personajes y asignar roles ilustrativos; datos editables sin identidad profesional inventada. | `src/data/characters.ts`, `docs/MEDIA.md` | F4-01 | Pendiente. |
| F5-02 | PENDING | Renderizar personaje responsive con alfa, entrada/salida y reemplazo por configuración. | componente de personaje | F5-01, F3-01 | Pendiente. |
| F5-03 | PENDING | Implementar diálogo paginado y controles de mouse, tacto y teclado; scroll no debe quitar contenido inesperadamente. | `src/data/dialogues.ts`, componente de diálogo | F5-02 | Pendiente. |

## Fase 6 — Partículas

| ID | Estado | Tarea y criterio de aceptación | Archivos previstos | Depende de | Resultado |
| --- | --- | --- | --- | --- | --- |
| F6-01 | PENDING | Añadir partículas opcionales por parada con configuración tipada y `pointer-events: none`. | `src/scripts/particles.ts`, componente | F3-01 | Pendiente. |
| F6-02 | PENDING | Detener escenas inactivas y reducir/desactivar movimiento según preferencias y rendimiento. | script/componente de partículas | F6-01 | Pendiente. |

## Fase 7 — Diseño comercial

| ID | Estado | Tarea y criterio de aceptación | Archivos previstos | Depende de | Resultado |
| --- | --- | --- | --- | --- | --- |
| F7-01 | PENDING | Diseñar portada y secciones semánticas: negocio, servicios confirmados, instalaciones, ubicación, contacto y FAQ. | `src/pages/index.astro`, componentes, estilos | F1-03 | Pendiente; datos comerciales por validar. |
| F7-02 | PENDING | Configurar CTA WhatsApp y navegación alternativa usable sin videos. No mostrar número inventado. | `src/data/contact.ts`, componentes | F7-01 | Pendiente; requiere número oficial para enlace real. |
| F7-03 | PENDING | Validar diseño móvil, capas, foco y contraste con imágenes reales. | componentes/estilos | F3-03, F5-03, F7-01 | Pendiente. |

## Fase 8 — Educación y SEO

| ID | Estado | Tarea y criterio de aceptación | Archivos previstos | Depende de | Resultado |
| --- | --- | --- | --- | --- | --- |
| F8-01 | PENDING | Preparar artículos con URL independiente; publicar contenido clínico solo después de revisión editorial. | `src/pages/salud-oral/`, datos de artículos | F7-01 | Pendiente. |
| F8-02 | PENDING | Implementar metadatos, canonical, OG, sitemap, robots, enlazado y esquema adecuado a datos confirmados. | layout, páginas, configuración | F7-01 | Pendiente; dominio y datos por validar. |

## Fase 9 — Optimización y pruebas

| ID | Estado | Tarea y criterio de aceptación | Archivos previstos | Depende de | Resultado |
| --- | --- | --- | --- | --- | --- |
| F9-01 | PENDING | Probar recorrido en Chrome, Edge, Firefox, Safari/iPhone y Android; registrar entornos no disponibles. | `docs/PROGRESS.md`, ajustes | F4-03, F7-03 | Pendiente. |
| F9-02 | PENDING | Comprobar accesibilidad, fallback de red, movimiento reducido, ahorro de datos y build de producción. | código, `docs/PROGRESS.md` | F9-01 | Pendiente. |

## Fase 10 — Entrega

| ID | Estado | Tarea y criterio de aceptación | Archivos previstos | Depende de | Resultado |
| --- | --- | --- | --- | --- | --- |
| F10-01 | PENDING | Documentar instalación, configuración, medios y despliegue; revisar MVP contra los 17 criterios de `REQUIREMENTS.md`. | `README.md`, `docs/*.md` | F9-02 | Pendiente. |
| F10-02 | PENDING | Revisar datos comerciales y editoriales pendientes antes de cualquier publicación. | contenido y `docs/PROGRESS.md` | F10-01 | Pendiente; validación del negocio. |

## Datos pendientes de validación del negocio

- [ ] Número oficial de WhatsApp, teléfono y otros canales.
- [ ] Dirección exacta, enlace de mapa y horario.
- [ ] Servicios reales y habilitados, profesionales, autorizaciones y marca/logo.
- [ ] Texto comercial, FAQ y contenido clínico revisados.
- [ ] Dominio final, imagen social y condiciones de publicación.

## Registro de esta sesión

La sesión inicial revisó `start.txt`, los 18 archivos de `assets/` y la referencia Arko. La inspección básica confirmó 5 MP4, 9 imágenes de espacios y 4 PNG de personajes.

En F1-03 se creó la base Astro sin contenido comercial definitivo. `pnpm` en PowerShell falló por la política que bloquea `pnpm.ps1`; `pnpm.cmd` funcionó. La primera instalación en el entorno restringido falló con `EACCES` al registro npm. Con acceso de red autorizado, pnpm descargó dependencias; pnpm 11 exigió aprobar el script de Sharp, registrado como `allowBuilds.sharp: true`. Una reconstrucción concurrente de `node_modules` en modo no interactivo falló y la limpieza restringida se detuvo; se reparó con instalación secuencial desde caché. Verificación final: `pnpm.cmd install --offline --frozen-lockfile` terminó correctamente; `pnpm.cmd build` generó una página estática; `pnpm.cmd check` informó 0 errores, 0 advertencias y 0 sugerencias. No se probaron aún el motor de recorrido ni los medios en navegador. La siguiente tarea es F1-06.

F1-07 preparó el repositorio local para GitHub. El enlace remoto queda pendiente: Git no muestra `origin` ni commits, y el usuario pidió consultar antes de acciones fuera de esta carpeta. El siguiente trabajo técnico del checklist sigue siendo F1-06.

Tras F1-07, el usuario creó el commit inicial `8de4993` en `main` y configuró `origin` hacia `Eriold/sonrie-web`; las notas anteriores describen el estado histórico. F1-06 consultó la referencia Arko y sus rutas de licencia (404) y ejecutó `pnpm.cmd media:inspect` sobre los cinco originales. Se detectaron cuatro pistas AAC y keyframes escasos; los resultados completos están en `docs/MEDIA.md`. El almacén de pnpm ahora se fija dentro de la carpeta. Próxima tarea: F2-01.

Verificación de cierre de F1-06: `pnpm.cmd install --offline --frozen-lockfile` terminó sin cambios; `pnpm.cmd check` informó 0 errores, 0 advertencias y 0 sugerencias; `pnpm.cmd build` generó una página estática. `git diff --check` terminó sin errores y `git diff --name-only -- assets` no listó cambios. Se verificó que el almacén efectivo de pnpm apunta a `D:\Proyectos\Sonrie\landingpage\.pnpm-store\v11`.

El usuario autorizó un commit local de F1-06, creado como `b65daf3`; no hubo push. En F2-01 se consultó de nuevo `world.ts` de Arko y se implementó un timeline propio con video y parada por segmento. `pnpm.cmd test` falló inicialmente porque faltaban los módulos y, tras implementarlos, pasó 4/4. `pnpm.cmd check` informó 0 errores, 0 advertencias y 0 sugerencias; `pnpm.cmd build` generó 1 página estática. Los medios aún no se publican ni se reproducen: corresponde a F2-02 y F4-02.

Antes de F2-02 se creó el commit local `b900594` de F2-01, conforme a la instrucción nueva del usuario; no hubo push. F2-02 integró las URL de los cinco originales mediante Astro, sin copiarlos a `public/` ni alterarlos. El build emitió los cinco MP4 en `dist/_astro/`. Un navegador integrado no estaba disponible para la sesión, por lo que se usó Chrome local con `playwright-core`. `pnpm.cmd test:browser` comprobó los cinco tiempos de video al hacer scroll, retroceso al primero, videos pausados, enlace de salida, movimiento reducido y ausencia de errores de página. La carga, pósters y optimización definitivos siguen en F4-02/F4-03.

Después de un reinicio de Vite por el lockfile, una ejecución de `test:browser` encontró 0 videos antes de que el stage apareciera; la repetición pasó. Se añadió una espera por el primer video adjunto al DOM y la prueba volvió a pasar. El chequeo final de F2-02 fue `pnpm.cmd test` (4/4), `pnpm.cmd check` (0 diagnósticos), `pnpm.cmd build` (1 página y 5 MP4) y `pnpm.cmd test:browser` (5 videos, retroceso y fallback de movimiento reducido).

F2-03 quitó el padding global que reducía el ancho visible del video. Chrome verificó que el stage comienza en x=0 y mide 1280 px en escritorio y 390 px en móvil. Se añadieron controles para las cinco paradas, posicionados por las unidades del timeline, y se limpian las capas de video anterior al cambiar de tramo. El panel de depuración se genera solo en modo desarrollo. Verificación: `pnpm.cmd test` (4/4), `pnpm.cmd check` (0 diagnósticos), `pnpm.cmd build` (1 página), `pnpm.cmd test:browser` (saltos, scroll rápido, retorno, movimiento reducido y 0 errores de página); `dist/index.html` no contiene el panel. No se alteró `assets/`. F3-01 es la siguiente tarea y requiere registrar el commit local de la fase 2 antes de empezar, conforme a la instrucción del usuario.

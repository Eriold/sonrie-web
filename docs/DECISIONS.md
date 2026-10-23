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

## D-010 — Modelo del timeline (2026-10-22)

F2-01 separa los datos de cinco clips (`src/data/tour.ts`) de la función pura (`src/scripts/timeline.ts`). Cada segmento declara duración de video y longitudes relativas de scroll para video y parada; el identificador de parada aún no asigna un espacio físico. Como base provisional, cada video ocupa 4 unidades y cada parada 1,5; F2-02 convertirá una unidad en altura de viewport al construir el stage. `createTourTimeline` valida entradas y calcula fronteras. `resolveTourPosition` limita la posición al recorrido y devuelve segmento, fase, progresos, tiempo de video, archivo activo e ID de parada visible. En la frontera entre segmentos se activa el video siguiente; en el extremo final permanece la última parada. La función no conserva estado, por lo que saltos y retrocesos producen resultados deterministas.

## D-011 — Stage y carga inicial de videos (2026-10-22)

F2-02 convierte cada unidad del timeline en una altura de viewport dentro de `ScrollWorld.astro`. El stage sticky permanece visible mientras ScrollTrigger traduce el progreso de la sección a la función pura. Lenis alimenta ScrollTrigger desde el ticker de GSAP. Los cinco MP4 originales se importan por URL desde `assets/` mediante `src/data/media.ts`; Astro los emite con nombre versionado al build, sin cambiar los originales. Cada video lleva `muted`, `playsinline` y `preload="none"`; el controlador carga el activo y, al llegar a una parada, prepara el siguiente. El tiempo se asigna con `currentTime` y el video permanece pausado. Un fondo y un enlace de salida siguen disponibles si falla la carga; con movimiento reducido o ahorro de datos se muestra una vista estática. Los fondos fotográficos y pósters definitivos pertenecen a F3/F4.

## D-012 — Ancho completo y saltos del recorrido (2026-10-22)

El stage ocupa todo el ancho del viewport; se eliminó el padding del `body` y se conservó el espaciado propio del encabezado y del contenido posterior. Los cinco botones de parada calculan su destino desde `stopStart` y la distancia real de ScrollTrigger, y Lenis salta a esa posición de forma inmediata. Al cambiar de tramo se oculta el video previo hasta que el nuevo frame esté listo, mostrando el fondo de reserva. El panel de datos de scroll, fase, tiempo y visual se renderiza solo con `import.meta.env.DEV`; no aparece en el build de producción. En modo de movimiento reducido se ocultan los controles de salto porque el timeline no está activo.

## D-013 — Paradas visibles sobre intervalos existentes (2026-10-22)

El timeline de F2-01 ya intercala `stopUnits` después de cada video, con longitud independiente por segmento. F3-01 añade cinco paneles semánticos provisionales a ese estado sin duplicar el cálculo de scroll. `world.ts` muestra el panel correspondiente a `activeStopId` solo durante la fase `stop` y publica su progreso en el stage. El video activo conserva el fotograma final durante todo el intervalo. Los paneles no asignan todavía espacios físicos ni contenido comercial: esa identificación depende de la revisión de medios y las capas de fondo se implementarán en F3-02.

## D-014 — Tres fondos configurables y cierre sin foto (2026-10-22)

F3-02 define el modo de fondo y la foto homónima en cada segmento de `tour.ts`, separados de las URL de recursos en `media.ts`. Las paradas 1–4 usan por defecto `high-res-image` con sus WebP homónimos, de menor peso que los respectivos videos; el modo `poster-image` usa pósters extraídos del último frame y `video-freeze` mantiene el video pausado. La parada 5 usa solo `video-freeze`, sin foto ni póster, por aclaración expresa del usuario. Un selector exclusivo de desarrollo compara los modos disponibles. Las imágenes usan `object-fit: cover` y pueden sustituirse por archivos de mayor resolución con el mismo nombre y un nuevo build. La foto de Parte 2 tiene resolución cercana al video; las fotos 1–3 no coinciden estrechamente con el último frame, así que la continuidad queda pendiente de F4-01 y F3-03. Si una imagen todavía no cargó, se conserva el video o el fondo de reserva.

## D-015 — Foto antes de video y cuarto clip en espera (2026-10-22)

La corrección posterior del usuario sustituye el orden video→parada descrito en D-010, D-013 y D-014. El orden activo es foto 1→video 1→foto 2→video 2→foto 3→video 3→foto `Parte_4.webp`→video `Parte_5.mp4`; el último frame del video 5 cierra el recorrido sin otra foto. `Parte_4.mp4` existe físicamente y se conserva intacto en `assets/`, pero no se importa ni se muestra mientras se discute su uso. No se renombra `Parte_4.webp`: la configuración la vincula con `Parte_5.mp4`. Los pósters de comparación se extraen ahora del **primer** frame de cada video activo. La comparación visual confirmó encuadres cercanos entre cada foto y el primer frame correspondiente. `stopPlacement` permite paradas antes o después del video sin reescribir el motor; este recorrido configura cuatro paradas previas. `start.txt` y su copia `REQUIREMENTS.md` conservan la formulación inicial como historial; esta decisión del usuario es la prioridad vigente.

## D-016 — Cinco videos y foto renombrada para el quinto (2026-10-22)

El usuario aclaró que D-015 interpretó mal el cuarto tramo: `Parte_4.mp4` sí pertenece al recorrido y solo carece de foto previa. La secuencia vigente es foto 1→video 1→foto 2→video 2→foto 3→video 3→video 4→foto 5→video 5. El archivo original `assets/Parte_4.webp` se renombró a `assets/Parte_5.webp` por indicación expresa del usuario; esa foto abre `Parte_5.mp4`. La configuración usa `stopPlacement: 'none'` para el video 4, sin parada ni foto, y conserva las cuatro paradas fotográficas restantes. Esta decisión sustituye D-015 en cuanto al cuarto video y al nombre de la foto; la especificación fuente se conserva como registro histórico.

## D-017 — Conservar la capa saliente durante la carga (2026-10-22)

F3-03 prepara fotos y pósters con `HTMLImageElement.decode()` y carga el video activo y los segmentos vecinos. Solo activa el nuevo video cuando el fotograma pedido está disponible; hasta entonces conserva la capa anterior. Un cambio de capa mantiene brevemente la saliente bajo la entrante para evitar fondos vacíos durante el fundido. Si falla una foto de parada se presenta su póster; si tampoco está disponible, se mantiene el video decodificado o la última capa visible. La prueba de Chrome retrasó el cuarto video y bloqueó la foto 5 para verificar los respaldos.

## D-018 — Nombres de espacios basados en rasgos visibles (2026-10-22)

F4-01 confirmó que varios clips cruzan más de un espacio: los videos 2, 3, 4 y 5 no se pueden etiquetar como un consultorio único. La documentación describe recepción, pasillo y salas por objetos distintivos (reloj, cuadro de colibrí, panel azul). No se asignan números de consultorio, especialidades ni una toma de fachada inexistente en los cinco MP4. Se conserva la secuencia actual de `tour.ts`, pues cada foto corresponde espacialmente al inicio del video que abre; las diferencias de perspectiva se detallan en `docs/MEDIA.md`.

## D-019 — Foto final Parte 6 sin sexto video (2026-10-22)

El usuario añadió `Parte_6.webp` y pidió mostrarla al terminar `Parte_5.mp4`. La comparación con el último frame confirmó la sala del panel azul y su mobiliario, con perspectiva más abierta. El motor ya admite paradas después de un video: `Parte_4.mp4` lleva una parada posterior con `Parte_5.webp` (la portada del video 5) y `Parte_5.mp4` lleva la parada final con `Parte_6.webp`. Así el video 4 no tiene foto inicial y se conservan cinco clips. Se regeneró el póster de Parte 5 desde su último frame y se añadió el de Parte 4, también desde el último frame, como respaldos. Esta decisión sustituye la ausencia de foto final indicada en D-014 a D-018; las entradas anteriores permanecen como historial.

## D-020 — Medios versionados por Astro y verificación de producción (2026-10-22)

F4-02 confirma la decisión iniciada en D-011: importar los originales por URL desde `assets/` y dejar que Astro los copie al build con nombres versionados. La alternativa orientativa `public/video/` duplicaría los MP4 sin aportar una función necesaria. La prueba `pnpm.cmd test:production` verifica HTTP, MIME y hash de los 15 recursos servidos, reproducción por scroll de los cinco clips y respaldo ante fallo de un video. Se corrigió además el aviso cuando un video vecino ya había fallado durante la precarga antes de activarse.

## D-021 — Carga diferida de MP4 según progreso (2026-10-22)

F4-03 detectó que Chrome solicitaba videos lejanos al recibir cinco elementos con `src`, pese a `preload="none"`. El HTML conserva la URL versionada en `data-src`; el motor asigna `src` solo al video activo y, al pasar la mitad de un tramo, al siguiente. El anterior se prepara al volver hacia la primera mitad. Se mantienen cargados los clips ya visitados para facilitar el retroceso. En Chrome local la descarga inicial de video observada bajó de aproximadamente 9–11 MB a 3,0 MB. Los MP4 originales siguen intactos. En una red simulada de 4 Mb/s y 150 ms, entrar directamente en algunos tramos demoró varios segundos; se documenta como riesgo para pruebas posteriores de compatibilidad y rendimiento. La ausencia de `ffmpeg` local y la instrucción de no generar nuevos videos impiden justificar una recodificación apresurada; cualquier derivado futuro requiere evaluación visual y de compatibilidad.

## D-022 — Personajes provisionales después de mostrar la fotografía (2026-10-22)

Los cuatro PNG existentes son modelos de prueba, no representaciones de integrantes reales de Sonríe. F5-01 los registra por ID y archivo original en `src/data/characters.ts`, con etiquetas genéricas y sin atribuir nombres, credenciales ni servicios. La figura de recepción se reutiliza en las fotos 1 y 2; los otros tres prototipos se distribuyen en las fotos 3, 5 y 6. La aparición se controla con el progreso local de la parada: primero se muestra solo la fotografía y después, al llegar al 35 % de sus 1,5 unidades de scroll, se habilita el personaje. El mismo cálculo lo oculta al retroceder. F5-02 implementará la superposición; F5-03 añadirá los diálogos. La asignación y el umbral son datos editables para reemplazar los modelos cuando lleguen los definitivos.

## D-023 — Superposición reversible de prototipos (2026-10-23)

F5-02 publica los cuatro PNG originales mediante URL versionadas de Astro, sin alterarlos. Cada parada tiene una capa `<img>` decorativa, sin `src` inicial ni captura de eventos de puntero. El motor asigna la URL al avanzar a la mitad del umbral de aparición configurado y espera `decode()`; solo muestra la capa cuando la foto de la parada está activa y su progreso llega al 35 %. La animación breve de opacidad y desplazamiento se desactiva con movimiento reducido; al retroceder o salir de la parada, el personaje se oculta. Si falla el PNG, la foto permanece visible. En móvil se coloca entre la tarjeta superior y la navegación inferior; los diálogos de F5-03 tendrán que conservar ese espacio legible. Los prototipos siguen sin identidad profesional ni contenido clínico atribuido.

## D-024 — Diálogos paginados y enlaces verificables opcionales (2026-10-23)

F5-03 añade dos páginas de texto descriptivo por parada en `src/data/dialogues.ts`. Describen solo espacios observados y marcan los personajes como prototipos. El visitante cambia de página con botones; el scroll no pagina ni reinicia el texto al regresar a una parada. Una caja de novela visual sustituye el encabezado provisional después del 35 % de la parada y conserva el enlace para saltar el recorrido. Con movimiento reducido se presentan las cinco secciones de texto sin depender de video ni scroll animado.

Las acciones externas por diálogo son opcionales. Para mostrarlas se exige una persona identificada en datos como `verified-person`, nombre no vacío, confirmación individual de cada enlace y URL HTTPS. El enlace de acreditación solo admite `web.sispro.gov.co`. Los prototipos actuales no tienen nombre profesional ni acciones, de modo que **ningún botón de red o acreditación aparece en producción**. El sitio oficial [SISPRO ReTHUS](https://www.sispro.gov.co/central-prestadores-de-servicios/Pages/ReTHUS-Registro-de-Talento-Humano-en-Salud.aspx) enlaza la [consulta pública](https://web.sispro.gov.co/THS/Cliente/ConsultasPublicas/ConsultaPublicaDeTHxIdentificacion.aspx), que requiere datos de la persona; un enlace genérico no demuestra por sí solo sus credenciales. Antes de habilitar el botón para alguien real se deberán confirmar identidad, consentimiento, registro y URL vigente. No se recopilan ni publican números de identificación en esta fase.

## D-025 — Partículas decorativas por parada (2026-10-23)

F6-01 usa Canvas 2D sin dependencia nueva. `src/data/particles.ts` define por parada `enabled`, tipo (`dust`, `sparkle`, `soft-glow`), cantidad, velocidad, tamaño y colores. Los valores son deliberadamente bajos para conservar la lectura de la foto. El canvas cubre el stage con `pointer-events: none` y queda sobre el sombreado de fondo, pero debajo del personaje y del diálogo. Los efectos comienzan después del 35 % de scroll de cada parada, para dejar visible primero la fotografía sola; la segunda parada los desactiva como muestra de configuración opcional. Con movimiento reducido el canvas permanece oculto. El motor cancela el frame y limpia el dibujo al salir de una parada. F6-02 medirá el costo y ajustará visibilidad, ahorro de datos y equipos de menor rendimiento.

## D-026 — Workflow provisional para GitHub Pages (2026-10-23)

Por petición del usuario, se prepara el despliegue automático al subir cambios a `main` del repositorio `Eriold/sonrie-web`. Astro recibe `site=https://eriold.github.io` y `base=/sonrie-web` durante el build para que los recursos funcionen bajo la ruta del repositorio. El workflow comprueba tipos y pruebas unitarias, compila con pnpm y entrega `dist/` a GitHub Pages. El prototipo conserva `noindex`; se omite el sitemap en ese build mediante `PUBLIC_SITEMAP=false`. La configuración local no publica el sitio: falta seleccionar GitHub Actions como fuente de Pages y subir los cambios a `main`. Un dominio propio requerirá ajustar `site`, `base` y Pages.

## D-027 — Node LTS 24 para el workflow (2026-10-23)

El build remoto estaba fijado en Node 22.22.0, por debajo del mínimo `>=22.23.4` declarado por Astro 7.4.2 y dependencias del lockfile. Se ajusta el workflow a la rama LTS 24 y el mínimo de `package.json` a 22.23.4. Con Node 24.13.1 local, pnpm 11.1.1 instaló el lockfile congelado sin cambios, Astro Check informó cero diagnósticos, pasaron las 11 pruebas y se generó el build de Pages. No se cambian versiones de librerías por este motivo; el workflow remoto con Node 24 sigue pendiente de ejecución.

## D-028 — Un ciclo de círculos luminosos para todas las paradas (2026-10-23)

F6-02 adopta la preferencia visual del usuario: las cinco paradas fotográficas usan la misma configuración de círculos, con paleta pálida de verde, azul, blanco y amarillo. Cada partícula nace sin brillo, aumenta su luminosidad y se desvanece antes de reciclarse. Se conserva el retraso de aparición del 35 % para apreciar primero la foto. El motor usa un solo canvas, cancela los frames fuera de la parada, fuera del viewport o cuando la pestaña está oculta, y respeta movimiento reducido y ahorro de datos. Equipos de hasta cuatro núcleos o 4 GB reducen la cantidad y la frecuencia de dibujo. Esta decisión sustituye la variedad de efectos y la parada 2 desactivada de D-025, conservada allí como historial.

## D-029 — Videos compatibles y scroll más corto solo en móvil (2026-10-23)

El usuario reportó lentitud en Infinix «30 pro» e iPhone 14 Pro Max y pidió preservar la versión de PC. Los MP4 originales AV1 no son adecuados para ese iPhone: [Apple](https://support.apple.com/en-asia/111846) enumera H.264 y HEVC para ese modelo y [WebKit](https://webkit.org/blog/14445/webkit-features-in-safari-17-0/) condiciona AV1 al decodificador de hardware. Se generan derivados H.264, sin audio, con keyframes cada 0,5 s y `faststart`, sin sobrescribir `assets/`. En vertical se recorta el centro a 480×1040; reproduce el encuadre que el `object-fit: cover` horizontal ya daba al teléfono y evita descargar laterales invisibles. En horizontal se conserva el cuadro completo a 1280×720. La orientación selecciona la variante antes de cargar el clip y la actualiza al girar.

Solo móvil usa 2,5 unidades de scroll por video en lugar de 4; las paradas conservan 1,5 unidades para leer el diálogo. La longitud total baja de 27,5 a 20 alturas de pantalla. Desktop conserva los cinco AV1 y su timeline previo. Se eligió 480 píxeles de **ancho vertical**, no 480p horizontal: el último produciría un recorte útil de unos 220 píxeles de ancho al llenar una pantalla vertical. La prueba visual local del encuadre vertical y la prueba de Chrome con tacto emulado pasaron; la calidad percibida y fluidez en los dos teléfonos reportados siguen pendientes de validar. No se copiaron medios ni código de la referencia Arko; se consultó de nuevo su motor como referencia antes del ajuste.

## D-030 — Riel de progreso con acceso continuo (2026-10-23)

Los botones 01–05 siguen siendo saltos directos a las paradas, pero ahora comparten un riel vertical cuya escala representa el progreso completo del recorrido. Su posición se calcula a partir de `stopStart / totalUnits`, por separado para móvil y escritorio; los espacios entre marcas corresponden a videos y paradas reales, no a distancias visuales arbitrarias. Tocar, hacer clic o arrastrar entre números transforma el porcentaje del riel en la misma posición que usa ScrollTrigger, de modo que no existe otro reloj para el video. También se captura un arrastre iniciado sobre un botón; un movimiento menor de 8 px conserva el clic de salto y uno mayor navega de forma continua. Una línea horizontal blanca que cruza el riel y la porción iluminada de la línea vertical muestran la posición actual incluso al desplazarse fuera del control. El indicador horizontal sustituye al punto verde tras la revisión visual del usuario; el borde oscuro ayuda a distinguirlo sobre fondos claros. El slider admite teclado y anuncia tramo y porcentaje; los botones conservan sus nombres y `aria-current`. La interfaz está oculta cuando el recorrido animado se desactiva por movimiento reducido o ahorro de datos.

## D-031 — Apariencia de tira de película para la navegación (2026-10-23)

Tras aprobar el comportamiento del riel, el usuario pidió retirar los círculos y revisar los colores. La navegación adopta una columna oscura translúcida con marcas rectangulares 01–05, tipografía monoespaciada y una paleta neutra de marfil y gris carbón. La marca activa invierte estos tonos. Se mantiene la línea horizontal que cruza el progreso, así como la posición y las áreas interactivas de los cinco botones. La capa visual no usa filtros de desenfoque ni añade imágenes o animaciones, para evitar costo extra en móviles. F7-03 revisará el lenguaje visual completo y su contraste en los dispositivos reales.

## D-032 — Riel sin fondo continuo (2026-10-23)

El usuario pidió retirar la columna oscura de D-031. El riel conserva solo la línea de progreso, el indicador horizontal y las cinco marcas rectangulares individuales; se eliminan fondo, borde y sombra del contenedor. Un contorno fino oscuro en la línea mantiene contraste sobre los fotogramas claros sin cubrir el video. La geometría y la lógica del control no cambian.

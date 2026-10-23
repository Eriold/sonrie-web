# Inventario de medios

Inspección local: 2026-10-22. Rutas actuales relativas a la raíz: `assets/`. Tamaños exactos en bytes. Metadatos de video leídos con OpenCV; imágenes con Pillow. No se copiaron, recodificaron ni alteraron los originales.

## Videos

| Archivo | Bytes | Dimensiones | FPS | Fotogramas | Duración aprox. | Escena confirmada |
| --- | ---: | --- | ---: | ---: | ---: | --- |
| `Parte_1.mp4` | 3.022.662 | 1920×1080 | 24 | 81 | 3,375 s | Pendiente |
| `Parte_2.mp4` | 7.696.774 | 1920×1080 | 24 | 435 | 18,125 s | Pendiente |
| `Parte_3.mp4` | 2.084.156 | 1920×1080 | 24 | 160 | 6,667 s | Pendiente |
| `Parte_4.mp4` | 1.547.984 | 1920×1080 | 24 | 141 | 5,875 s | Pendiente |
| `Parte_5.mp4` | 2.553.891 | 1920×1080 | 24 | 181 | 7,542 s | Pendiente |

La tabla anterior conserva la inspección inicial con OpenCV. F1-06 añadió `ffprobe` mediante `@ffprobe-installer/ffprobe` como dependencia de desarrollo; los resultados se pueden repetir con `pnpm media:inspect` (en PowerShell, `pnpm.cmd media:inspect`). Las cinco duraciones calculadas inicialmente coinciden con las duraciones del contenedor dentro del redondeo mostrado.

| Archivo | Video / perfil | Keyframes (índices de frame, base 0) | Audio | Color | `moov` antes de `mdat` |
| --- | --- | --- | --- | --- | --- |
| `Parte_1.mp4` | AV1 Main, yuv420p | 0 | Sin pista | BT.709, rango TV | Sí |
| `Parte_2.mp4` | AV1 Main, yuv420p | 0, 161, 322 | AAC estéreo, 48 kHz | BT.709, rango TV | Sí |
| `Parte_3.mp4` | AV1 Main, yuv420p | 0 | AAC estéreo, 48 kHz | BT.709, rango TV | Sí |
| `Parte_4.mp4` | AV1 Main, yuv420p | 0 | AAC estéreo, 48 kHz | BT.709, rango TV | Sí |
| `Parte_5.mp4` | AV1 Main, yuv420p | 0, 161 | AAC estéreo, 48 kHz | BT.709, rango TV | Sí |

Todos son 1920×1080 a 24 FPS. `color_space`, `color_transfer` y `color_primaries` son `bt709` en los cinco. Los clips 2 y 5 tienen 161 frames entre keyframes (aprox. 6,71 s); los clips 1, 3 y 4 solo tienen keyframe al inicio. Esto puede hacer costoso el seek repetido del recorrido, pero aún no se ha probado en navegador ni se ha recodificado. `moov` precede a `mdat` en todos, señal de disposición `faststart` del contenedor. Las pistas AAC de 2 a 5 contradicen la descripción de “sin audio” en `start.txt`; su presencia está confirmada, pero aún no se ha comprobado si contienen sonido perceptible. El reproductor del recorrido deberá silenciarlas y no asumir ausencia de pista.

## Fotos candidatas para paradas

| Archivo | Bytes | Dimensiones | Formato/modo | Relación con clip |
| --- | ---: | --- | --- | --- |
| `Parte_1.jpg` | 535.725 | 4000×2252 | JPEG/RGB | Pendiente de comparar |
| `Parte_1.webp` | 534.384 | 4032×2268 | WebP/RGB | Pendiente de comparar |
| `Parte_2.png` | 9.509.249 | 3999×2240 | PNG/RGBA | Pendiente de comparar |
| `Parte_2.webp` | 1.211.590 | 1921×1076 | WebP/RGBA | Pendiente de comparar |
| `Parte_2_old.png` | 738.956 | 1921×1076 | PNG/paleta | Versión antigua; conservar, no usar por defecto |
| `Parte_3.jpg` | 343.121 | 4000×2252 | JPEG/RGB | Pendiente de comparar |
| `Parte_3.webp` | 679.966 | 4000×2252 | WebP/RGB | Pendiente de comparar |
| `Parte_4.jpg` | 502.319 | 4000×2252 | JPEG/RGB | Pendiente de comparar |
| `Parte_5.webp` | 943.640 | 4000×2252 | WebP/RGB | Antes `Parte_4.webp`; portada del video 5 |
| `Parte_6.webp` | 442.708 | 4000×2252 | WebP/RGB | Foto final, posterior a `Parte_5.mp4`; añadida por el usuario |

En el inventario inicial no existía imagen `Parte_5` en `assets/`; la corrección vigente del usuario renombró `Parte_4.webp` a `Parte_5.webp`. La transparencia efectiva de las imágenes 2 se comprobó en F4-01. La comparación relevante para las fotos activas es con el **primer** frame del video que abren, no con el último.

**Estado observado al iniciar F3-02 (2026-10-22):** `Parte_1.jpg`, `Parte_2_old.png`, `Parte_3.jpg` y `Parte_4.jpg` figuran eliminados en el árbol de trabajo de Git; no se restauran ni se incorporan a esta tarea. Permanecen `Parte_1.webp` a `Parte_4.webp` y `Parte_2.png`. La relación por nombre indicada por el usuario se toma como candidata para las cuatro primeras paradas, pendiente de comparar encuadres. `Parte_2.webp` mide 1921×1076, prácticamente la resolución del video 1920×1080; el PNG homónimo sí mide 3999×2240, pero pesa 9,5 MB. La quinta parada sigue sin foto homónima. Estos datos sustituyen el inventario inicial solo para las rutas disponibles en F3-02; los registros anteriores conservan su valor histórico.

El usuario aclaró que la parada 5 es el cierre y no necesita foto independiente. La comparación visual local del último frame con el WebP homónimo mostró: Parte 1, misma zona de recepción con otro encuadre; Parte 2, el video termina en sala clínica y la foto muestra recepción; Parte 3, el video termina en pasillo y la foto muestra sala clínica; Parte 4, encuadres cercanos de la misma sala. Por instrucción del usuario se conserva la asociación por nombre en F3-02; F4-01 revisará continuidad y asignación definitiva antes de decidir transiciones finales. La imagen de comparación temporal se generó en `dist/` (ignorado por Git).

F3-02 generó pósters WebP desde el último fotograma de `Parte_1.mp4` a `Parte_4.mp4` con OpenCV y Pillow, mediante `pnpm.cmd exec python` y sin modificar los videos: 1920×1080 cada uno; tamaños 90.882, 46.308, 39.036 y 78.812 bytes (255.038 bytes en total). Se guardaron en `src/media/posters/` para que el build los publique. No se generó ni utiliza póster de Parte 5, conforme a la aclaración del usuario. Las fotos predeterminadas son `Parte_1.webp` a `Parte_4.webp`; CSS las adapta al viewport con `object-fit: cover`, conservando proporción y recortando cuando cambia la relación de aspecto. Cambiar a futuro la resolución del archivo con el mismo nombre no requiere cambiar el motor; habrá que reconstruir el sitio y comprobar nitidez y encuadre. `Parte_2.webp` es casi del tamaño del video en píxeles, aunque ocupa menos bytes; una variante mayor y liviana puede prepararse después.

**Corrección vigente del usuario:** la foto aparece **antes** del video. La relación comprobada visualmente entre foto y primer frame es:

| Portada | Video siguiente | Estado |
| --- | --- | --- |
| `Parte_1.webp` | `Parte_1.mp4` | Encuadre cercano |
| `Parte_2.webp` | `Parte_2.mp4` | Encuadre cercano |
| `Parte_3.webp` | `Parte_3.mp4` | Misma sala con leve diferencia de encuadre |
| `Parte_5.webp` | `Parte_5.mp4` | Misma sala con leve diferencia de encuadre |

`Parte_4.mp4` no forma parte del recorrido activo, pero permanece intacto en `assets/` mientras el usuario decide su lugar. No se renombró `Parte_4.webp`; la relación se declara en `src/data/tour.ts`. Se sustituyeron los pósters anteriores por primeros frames de los videos activos 1, 2, 3 y 5, generados con OpenCV/Pillow mediante pnpm: 165.334, 118.464, 48.504 y 92.670 bytes (425.972 bytes en total), todos a 1920×1080. El video 5 termina sin portada posterior. Las descripciones anteriores de foto al final y pósters del último frame documentan el estado previo y quedan sustituidas por este párrafo.

**Corrección vigente:** `Parte_4.mp4` sí se reproduce, inmediatamente después de `Parte_3.mp4`, sin foto ni parada previa. Por solicitud del usuario, `Parte_4.webp` se renombró a `Parte_5.webp`, sin alterar los bytes de imagen; aparece antes de `Parte_5.mp4`. Hay cinco videos y cuatro fotos activas. El párrafo anterior conserva el registro de la interpretación equivocada, sustituida por esta corrección.

## F4-01 — Continuidad y espacios observados (2026-10-22)

Se extrajeron fotogramas 0, 25 %, 50 %, 75 % y final de cada MP4 con OpenCV/Pillow, sin alterar los originales. Las láminas [Parte 1](media-review/Parte_1-contacto.jpg), [Parte 2](media-review/Parte_2-contacto.jpg), [Parte 3](media-review/Parte_3-contacto.jpg), [Parte 4](media-review/Parte_4-contacto.jpg) y [Parte 5](media-review/Parte_5-contacto.jpg) muestran esos cinco puntos junto a la portada activa al momento de F4-01, cuando existía. La [comparación del cierre](media-review/Parte_5-cierre.jpg) añade `Parte_6.webp` junto al último frame del video 5. Las descripciones siguientes identifican rasgos visibles, no números de consultorio ni servicios autorizados.

| Clip | Recorrido visible dentro del clip | Portada anterior → primer frame | Salida → visual siguiente |
| --- | --- | --- | --- |
| `Parte_1.mp4` | Recepción: sofá y letrero, mostrador, TV y ventanal. La cámara gira hacia el mostrador. | `Parte_1.webp`: misma recepción y encuadre muy cercano; cambia la imagen de la TV y hay leve variación de perspectiva. | `Parte_2.webp`: sigue en recepción, pero encuadra el mostrador más de frente; hay corte de cámara perceptible. |
| `Parte_2.mp4` | Parte del mostrador de recepción, cruza la zona del letrero en vidrio y entra en una sala con sillón odontológico y reloj de pared. | `Parte_2.webp`: mismo mostrador y ventanal; encuadre muy cercano al primer frame, con pequeñas variaciones de luz y perspectiva. | `Parte_3.webp`: misma sala con sillón y reloj, desde un punto de vista desplazado; no es el mismo fotograma. |
| `Parte_3.mp4` | Sale de la sala con sillón y reloj hacia el pasillo de divisiones blancas. | `Parte_3.webp`: misma sala y elementos, pero encuadre más abierto y desplazado respecto del primer frame. | `Parte_4.mp4` empieza en el mismo pasillo y con orientación similar; unión cercana, sin foto intermedia. |
| `Parte_4.mp4` | Avanza por ese pasillo y entra en una sala con sillón y un cuadro de colibrí. | No tiene portada fotográfica. El primer frame continúa de cerca el final de `Parte_3.mp4`. | `Parte_5.webp`: misma sala del colibrí, pero desde un ángulo más frontal y abierto; hay salto de perspectiva. |
| `Parte_5.mp4` | Parte de la sala del colibrí, vuelve al pasillo y termina en otra sala con sillón y panel azul de Sonríe. | `Parte_5.webp`: misma sala del colibrí y equipamiento, con variación moderada de encuadre frente al primer frame. | `Parte_6.webp`: misma sala final, sillón y panel azul; foto más amplia y frontal que el último frame. |

**Asignación provisional de las cinco paradas:** `parada-1` y `parada-2` muestran la recepción desde ángulos distintos; `parada-3` muestra la sala del sillón y reloj; `parada-5` muestra la sala del colibrí después del video 4 y antes del 5; `parada-6` muestra la sala final con panel azul después del video 5. La numeración conserva los nombres de recursos y salta el pasillo de Parte 4, sin foto propia. No hay tomas que permitan afirmar un recorrido por fachada o entrada exterior, ni evidencia suficiente para numerar consultorios o asignarles funciones. Estas descripciones no se publican como contenido comercial definitivo.

**Transiciones:** las cuatro portadas de entrada se parecen al primer frame de su clip y la foto final se parece al último frame del video 5, pero ninguna es idéntica píxel a píxel. Conviene conservar el fundido y la capa anterior de F3-03; no usar un corte que prometa continuidad exacta. La unión sin portada entre videos 3 y 4 es la más cercana. La continuidad espacial general queda sustentada por elementos repetidos, mientras los cambios de punto de vista indicados en la tabla son visibles. La corrección posterior del usuario añade la foto final y queda registrada en D-019.

**Corrección de secuencia posterior a F4-01:** `Parte_6.webp` llegó a `assets/` y coincide espacialmente con el último fotograma de `Parte_5.mp4`: mismo panel azul, sillón y mobiliario, con una perspectiva más amplia y leve diferencia de iluminación. Mide 4000×2252 px, pesa 442.708 bytes y es RGB sin alfa. El recorrido vigente es foto 1→video 1→foto 2→video 2→foto 3→video 3→video 4→foto 5→video 5→foto 6. La foto 5 se modela como parada **después** del video 4 para que el quinto video pueda terminar en otra parada **después** de sí mismo; sigue siendo la foto previa al video 5. El video 4 no tiene foto antes de comenzar. Se extrajeron pósters del **último** frame de los videos 4 y 5: 1920×1080, 72.572 y 64.806 bytes. Los pósters 1–3 continúan basados en el primer frame. No se alteraron los MP4 ni los WebP originales.

## F4-02 — Publicación y comprobación de recursos (2026-10-22)

`src/data/media.ts` importa los cinco MP4 y las cinco fotos WebP por URL desde `assets/`; los cinco pósters derivados se importan desde `src/media/posters/`. Astro emite los 15 recursos con nombres versionados en `dist/_astro/`. Se conserva un solo ejemplar de cada original en `assets/`, sin duplicarlo en `public/` ni recodificarlo.

Con `pnpm.cmd build` y `pnpm.cmd preview --host 127.0.0.1 --port 4321`, `pnpm.cmd test:production` obtuvo HTTP 200 y MIME `video/mp4` o `image/webp` según el caso. Los SHA-256 de las respuestas fueron idénticos a los de los cinco videos y cinco fotos originales y a los cinco pósters de `src/media/posters/`. Chrome verificó avance controlado por scroll en los cinco videos, todos pausados, la foto final y ausencia de errores de página. Al bloquear la descarga de `Parte_4.mp4`, permaneció visible el video anterior y apareció el aviso de recurso no disponible. Esta prueba cubre el servidor local de vista previa; compatibilidad y rendimiento en otros navegadores quedan para F4-03 y F9-01.

## F4-03 — Seek, carga y pistas de audio (2026-10-22)

`pnpm.cmd media:inspect` volvió a confirmar AV1 a 24 FPS, un solo keyframe en los clips 1, 3 y 4, y separaciones de 161 frames (6,71 s) en los clips 2 y 5. Todos tienen `faststart`. La pista AAC de cada clip 2–5 se decodificó en Chrome con RMS y pico **0** en ambos canales; el clip 1 no tiene pista de audio. Los videos continúan silenciados en el recorrido.

Se ejecutó `pnpm.cmd exec node scripts/audit-video-performance.mjs` contra Astro Preview con Chrome 156 y caché desactivada. El script espera un segundo tras abrir la página, salta a una posición temprana y otra tardía de cada video, vuelve a la temprana y espera el fotograma correcto. Antes del cambio, la primera descarga de video fue de 9–11 MB; con URL diferida y carga del siguiente al superar 50 % del tramo, se observaron **3,02 MB** al segundo inicial. Tras recorrer todo, los cinco MP4 sumaron **16,91 MB recibidos**. En la pasada local posterior, las entradas a cada tramo tomaron 34–290 ms y los saltos internos y de regreso 4–69 ms. El heap de JavaScript al final fue 2,4 MiB usados; esta métrica **no incluye** memoria de decodificación de video. Los cinco clips permanecieron en búfer tras visitarlos.

Con `SONRIE_AUDIT_SLOW=1` se simuló 4 Mb/s y 150 ms de latencia. Las entradas a los cinco videos tomaron 9,24 s, 5,31 s, 1,77 s, 1,53 s y 4,72 s en una corrida; una vez disponible el fotograma, avance y retroceso dentro del clip tomaron 3–10 ms. Es una simulación puntual, no una garantía para redes o dispositivos reales. El inicio de un tramo lejano sigue siendo costoso porque sus keyframes son escasos y debe descargarse y decodificarse video anterior. La F9-01 comprobará otros navegadores y dispositivos antes de decidir si se necesitan versiones derivadas de algún MP4. Los originales no se modificaron.

**Transparencia de Parte 2:** Pillow confirmó píxeles transparentes en `Parte_2.png` (0,70 % totalmente transparentes; 0,42 % parciales) y `Parte_2.webp` (0,87 % totalmente transparentes). La foto WebP puede dejar ver el fondo en bordes; revisar la composición en F4-02/F7-03. El PNG de 9,5 MB muestra el mismo mostrador como alternativa de mayor resolución, pero no se cambia la portada activa sin evaluar peso y encuadre.

## Personajes

| Archivo | Bytes | Dimensiones | Transparencia técnica | Rol confirmado |
| --- | ---: | --- | --- | --- |
| `Friendly Anime Dentist Demonstrating Dental Model.png` | 1.717.267 | 1024×1536 | Canal alfa | Pendiente |
| `Friendly Anime Dentist with Dental Mirror.png` | 1.637.013 | 1024×1536 | Canal alfa | Pendiente |
| `Friendly Mint Receptionist Illustration.png` | 1.447.656 | 1024×1536 | Canal alfa | Pendiente |
| `Friendly Orthodontist Presenting Braces Model.png` | 858.821 | 1086×1448 | Canal alfa | Pendiente |

Estos son los nombres completos reales. La asignación a roles, identidad y espacios exige inspección visual y validación editorial. Hay cuatro PNG para cinco roles previstos; no asignar un personaje ficticio a un profesional real.

### F5-01 — Inspección visual y asignación provisional (2026-10-22)

Se abrieron los cuatro PNG. Todos son ilustraciones de cuerpo completo con fondo transparente: los tres de 1024×1536 tienen entre 69,7 % y 75,9 % de píxeles totalmente transparentes; el de 1086×1448 tiene 72,8 %. Los bordes y sombras usan alfa parcial, que debe conservarse al superponerlos a las fotografías. El archivo de recepción muestra portapapeles y pañuelo verde; el del espejo muestra ese instrumento y uniforme verde claro; el del modelo dental muestra una dentadura y uniforme azul; el cuarto muestra otra figura con modelo de dentadura y uniforme azul. Esas pistas visuales no verifican cargos, servicios ni identidad de personas reales.

`src/data/characters.ts` registra los cuatro como `prototype` y usa etiquetas públicas genéricas de guía ilustrativa. Asignación editable por parada: fotos 1 y 2 → recepción; foto 3 → espejo; foto 5 → modelo dental; foto 6 → cuarta figura. Se reutiliza el primer prototipo porque hay cinco fotos y cuatro PNG. Cada parada reserva el primer 35 % de su progreso de scroll para apreciar la fotografía sola; el personaje se habilita después de ese umbral y se oculta al retroceder. Los originales futuros podrán reemplazar la referencia de imagen sin cambiar la secuencia ni los nombres de las paradas. La superposición visual y su adaptación responsive pertenecen a F5-02; el contenido editorial de los diálogos sigue pendiente.

## Pendientes audiovisuales

- [x] Extraer y comparar primer/último fotograma de cada clip con fotos candidatas y clips vecinos; registrar espacio, dirección, encuadre y continuidad. F4-01: tabla y cinco láminas anteriores.
- [x] Determinar si la parada final requiere foto, último fotograma congelado o póster generado. La corrección vigente del usuario usa `Parte_6.webp` después del video 5, con su último frame y póster como respaldos.
- [x] Confirmar presencia de pistas, códec, keyframes, color y `faststart` con `ffprobe`.
- [x] Medir seek y scrubbing en Chrome local, carga de red y silencio de las pistas AAC; F4-03. Compatibilidad en otros navegadores y posible recodificación derivada quedan para F9-01 según resultados.
- [ ] Inspeccionar transparencia efectiva y contenido de cada PNG, y asignar rol sin atribuir nombre ni credenciales.
- [x] Definir pósters a partir de videos, estrategia de carga y rutas publicadas; conservar `assets/`. Verificado en F4-02 con el build estático servido.
- [ ] Registrar logo, imagen social y datos del negocio cuando se reciban.

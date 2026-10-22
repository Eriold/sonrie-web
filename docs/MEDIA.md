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

La especificación los describe como videos sin audio. Aún falta comprobar pista de audio, códec, GOP, keyframes, colores y disposición `faststart` con `ffprobe` o herramienta equivalente. Las duraciones provienen de fotogramas/FPS y son aproximadas.

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
| `Parte_4.webp` | 943.640 | 4000×2252 | WebP/RGB | Pendiente de comparar |

No existe imagen `Parte_5` en `assets/`. Los canales RGBA de las imágenes 2 no prueban que tengan píxeles transparentes visibles; debe verificarse antes de usarlas como fondos. Ninguna foto está validada como último frame del clip homónimo.

## Personajes

| Archivo | Bytes | Dimensiones | Transparencia técnica | Rol confirmado |
| --- | ---: | --- | --- | --- |
| `Friendly Anime Dentist Demonstrating Dental Model.png` | 1.717.267 | 1024×1536 | Canal alfa | Pendiente |
| `Friendly Anime Dentist with Dental Mirror.png` | 1.637.013 | 1024×1536 | Canal alfa | Pendiente |
| `Friendly Mint Receptionist Illustration.png` | 1.447.656 | 1024×1536 | Canal alfa | Pendiente |
| `Friendly Orthodontist Presenting Braces Model.png` | 858.821 | 1086×1448 | Canal alfa | Pendiente |

Estos son los nombres completos reales. La asignación a roles, identidad y espacios exige inspección visual y validación editorial. Hay cuatro PNG para cinco roles previstos; no asignar un personaje ficticio a un profesional real.

## Pendientes audiovisuales

- [ ] Extraer y comparar primer/último fotograma de cada clip con fotos candidatas y clips vecinos; registrar espacio, dirección, encuadre y continuidad.
- [ ] Determinar si la parada final requiere foto, último fotograma congelado o póster generado.
- [ ] Confirmar audio, códec, GOP/keyframes, color, seek y `faststart`; recodificar solo si la prueba de scrubbing lo exige.
- [ ] Inspeccionar transparencia efectiva y contenido de cada PNG, y asignar rol sin atribuir nombre ni credenciales.
- [ ] Definir pósters a partir de videos, estrategia de carga y rutas publicadas; conservar `assets/`.
- [ ] Registrar logo, imagen social y datos del negocio cuando se reciban.

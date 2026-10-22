# SONRÍE — LANDING CINEMATOGRÁFICA INTERACTIVA
## Especificación maestra v2.0 para Codex

**Proyecto:** Sonríe Urrao  
**Tipo:** Landing comercial con recorrido virtual interactivo  
**Ubicación del negocio:** Urrao, Antioquia, Colombia  
**Objetivo principal:** Aumentar la visibilidad del establecimiento y conseguir nuevos pacientes.  
**Modo de trabajo:** Implementación incremental con memoria persistente en Git.  

---

# 1. MISIÓN Y FORMA DE TRABAJO

Actúa como ingeniero senior frontend especializado en Astro, TypeScript, GSAP, experiencias web cinematográficas, optimización audiovisual, UX/UI, rendimiento, accesibilidad y SEO.

Debes construir una landing page real y funcional para el centro odontológico Sonríe.

La experiencia principal permitirá recorrer las instalaciones mediante cinco videos MP4 cuyo avance y retroceso dependerá del scroll del visitante.

Al finalizar cada video debe existir la posibilidad de mostrar una parada interactiva con fondo fotográfico, personaje estilo anime/visual novel, diálogo, partículas y botones informativos.

El sitio debe ser moderno, elegante, rápido, adaptable a móviles y comercialmente efectivo.

**Debes escribir y modificar código real dentro del repositorio. No entregues únicamente una explicación de cómo construirlo.**

Trabaja por fases verificables. Mantén el proyecto compilable y registra el progreso de forma permanente.

No necesitas pedir confirmación para detalles técnicos ordinarios; toma decisiones justificadas y documenta tus supuestos. Reserva las preguntas para datos indispensables que no puedan resolverse mediante configuraciones provisionales.

---

# 2. REFERENCIA TÉCNICA OBLIGATORIA

Repositorio:

https://github.com/midudev/mcp-higgsfield-landing

Demo:

https://arko-sushi.midudev.workers.dev/

Antes de implementar, estudia el repositorio y especialmente:

- `package.json`
- `README.md`
- `PROMPTS.md`
- `astro.config.mjs`
- `src/scripts/world.ts`
- `src/scripts/motion.ts`
- `src/components/ScrollWorld.astro`
- `src/components/Stop.astro`
- `src/data/arko.ts`
- `src/styles/global.css`

Estudia cómo implementa:

1. Scroll-world con videos.
2. Sincronización de `currentTime` con el desplazamiento.
3. Avance y retroceso bidireccional.
4. Interpolación de posiciones.
5. GSAP ScrollTrigger y Lenis.
6. Stage sticky a pantalla completa.
7. Precarga de videos.
8. Pósters de respaldo.
9. Descarga mediante Blob.
10. Navegación entre paradas.
11. Encuadres responsive.
12. Adaptación a Safari/iOS.
13. Fallback para movimiento reducido y ahorro de datos.

Utiliza su solución como referencia técnica, extendiéndola para las necesidades de Sonríe.

No copies su identidad visual de restaurante, fotografías, textos comerciales ni elementos de marca.

Verifica los permisos y licencias aplicables antes de reutilizar código o recursos.

Si no tienes acceso al repositorio externo, documenta la limitación y desarrolla una implementación equivalente sin bloquear todo el proyecto.

---

# 3. TECNOLOGÍAS

Utiliza el mismo stack principal del proyecto de Midudev:

- Astro 7.
- TypeScript.
- Tailwind CSS 4.
- GSAP 3 y ScrollTrigger.
- Lenis.
- Sharp.
- Phosphor Icons.
- @astrojs/sitemap.
- pnpm.
- Node.js compatible con Astro 7.

El proyecto debe poder generar un sitio estático.

No migres a Next.js.

No agregues React salvo necesidad técnica demostrable.

Prioriza componentes Astro, JavaScript/TypeScript nativo y renderizado estático.

Para partículas, prioriza Canvas 2D o CSS. Incorpora otra biblioteca solamente si existe una justificación clara.

Mantén un `pnpm-lock.yaml` reproducible.

---

# 4. CONTEXTO DEL NEGOCIO

Sonríe es un establecimiento odontológico ubicado en Urrao, Antioquia.

Responsable del negocio: Estela.

Tiene una sola sede principal, que será el objeto de esta landing.

Existe otro negocio del mismo propietario denominado Sonríe Premium, relacionado con procedimientos estéticos. No debe incluirse automáticamente en este proyecto.

El objetivo comercial principal es conseguir más pacientes.

La landing debe:

- Mostrar las instalaciones.
- Transmitir confianza.
- Presentar servicios confirmados.
- Ofrecer información educativa sobre salud oral.
- Facilitar el contacto por WhatsApp.
- Mostrar ubicación y datos de contacto.
- Posicionarse en búsquedas relacionadas con odontología en Urrao.
- Permitir ampliaciones futuras.

No inventes horarios, profesionales, especialidades, precios, testimonios, equipos, autorizaciones sanitarias ni servicios.

Cualquier dato no confirmado debe quedar marcado como pendiente de validación y nunca publicarse como información definitiva.

---

# 5. INVENTARIO DE RECURSOS EXISTENTES

El usuario dispone de estos archivos audiovisuales, identificados a partir de una captura de la carpeta original.

## 5.1. Videos

```text
Parte_1.mp4
Parte_2.mp4
Parte_3.mp4
Parte_4.mp4
Parte_5.mp4
```

Tamaños aproximados mostrados en Windows:

| Archivo | Tamaño |
|---|---:|
| Parte_1.mp4 | 2.952 KB |
| Parte_2.mp4 | 7.517 KB |
| Parte_3.mp4 | 2.036 KB |
| Parte_4.mp4 | 1.512 KB |
| Parte_5.mp4 | 2.495 KB |

Todos son videos sin audio.

La resolución prevista es 1080p; verifica dimensiones, FPS, duración, formato y características reales mediante inspección técnica cuando estén disponibles.

No presupongas duraciones idénticas.

No generes videos nuevos.

## 5.2. Fotografías

```text
Parte_1.jpg
Parte_1.webp

Parte_2.png
Parte_2.webp
Parte_2_old.png

Parte_3.jpg
Parte_3.webp

Parte_4.jpg
Parte_4.webp
```

`Parte_2_old.png` es una versión anterior que debe conservarse, pero no seleccionarse automáticamente como definitiva.

No se ha identificado un archivo de imagen específico para Parte 5.

Los nombres reflejan el inventario disponible y no garantizan que cada imagen coincida exactamente con el último fotograma del video que comparte su número.

Antes de definir una transición, compara el último frame del video, la fotografía candidata y el primer frame del video siguiente.

Cuando no coincidan, documenta la discrepancia y prepara un fallback visual.

No deformes fotografías ni inventes elementos arquitectónicos.

## 5.3. Personajes anime

La carpeta original incluye cuatro archivos PNG cuyos nombres aparecen parcialmente truncados en una captura de Windows:

```text
Friendly Anime Den... [PNG A]
Friendly Anime Den... [PNG B]
Friendly Mint Recep... [PNG]
Friendly Orthodonti... [PNG]
```

Los dos archivos `Friendly Anime Den...` son recursos distintos.

Estos textos NO representan nombres completos de archivos.

Inspecciona los archivos reales para obtener nombres, dimensiones, transparencia y contenido.

No reconstruyas ni inventes nombres completos basándote en la captura.

Si los archivos no están disponibles en el workspace de Codex, registra los recursos faltantes y prepara placeholders funcionales.

No presupongas que los cuatro PNG cubren exactamente los cinco personajes requeridos.

## 5.4. Estructura sugerida

```text
public/
  video/
    Parte_1.mp4
    Parte_2.mp4
    Parte_3.mp4
    Parte_4.mp4
    Parte_5.mp4

  images/
    stops/
      Parte_1.jpg
      Parte_1.webp
      Parte_2.png
      Parte_2.webp
      Parte_2_old.png
      Parte_3.jpg
      Parte_3.webp
      Parte_4.jpg
      Parte_4.webp

    posters/
      [pósters generados a partir de los videos]

    characters/
      [archivos PNG reales de personajes]

    branding/
      [logo y recursos de identidad]
```

Esta estructura es orientativa.

No muevas ni elimines material original sin conservar una copia o tener los cambios controlados en Git.

Cuando un recurso no exista, mantén la aplicación compilable utilizando un placeholder explícito.

---

# 6. RECORRIDO FÍSICO Y NARRATIVO

El recorrido debe representar una visita a Sonríe.

Conceptualmente incluye:

1. Fachada del establecimiento.
2. Entrada principal.
3. Recepción.
4. Corredor interior.
5. Consultorio 1.
6. Consultorio 2.
7. Consultorio 3.
8. Regreso y salida.

El plano de navegación original tiene una ruta de entrada y otra de salida.

La entrada recorre fachada, recepción y corredor hacia los consultorios.

El regreso conecta con la zona de salida.

Existen cinco videos, por lo que no debes asumir un clip independiente para cada espacio.

La correspondencia definitiva entre videos y lugares debe determinarse inspeccionando el material real.

Permite configurar varios contenidos en una misma parada cuando corresponda.

El sistema debe permitir modificar o agregar paradas sin reescribir el motor de scroll.

---

# 7. EXPERIENCIA SCROLL-WORLD

La experiencia principal debe funcionar como en el repositorio de referencia.

El video NO avanza mediante reproducción automática.

Su tiempo depende directamente de la posición del scroll.

Comportamiento esperado:

- Scroll hacia abajo: el video avanza.
- Scroll hacia arriba: el video retrocede.
- Scroll detenido: la imagen permanece estable.
- Salto de navegación: se actualiza la escena correctamente.
- Desplazamiento rápido: no se rompe el estado.
- Regreso a una escena: debe recuperarse su fotograma correspondiente.

Implementa una función determinista que transforme la posición global del recorrido en:

- segmento activo,
- fase del segmento,
- progreso de video,
- progreso de parada,
- recursos visuales activos,
- elementos informativos visibles.

No dependas de temporizadores para decidir el avance de escenas.

---

# 8. VIDEO → PARADA → SIGUIENTE VIDEO

Este es el requisito técnico más importante.

Cada video conduce a una parada interactiva.

El flujo debe ser:

```text
VIDEO 1
  ↓
PARADA 1
  ↓
VIDEO 2
  ↓
PARADA 2
  ↓
VIDEO 3
  ↓
PARADA 3
  ↓
VIDEO 4
  ↓
PARADA 4
  ↓
VIDEO 5
  ↓
PARADA FINAL
```

El recorrido debe ser reversible.

Cada parada tiene una cantidad configurable de scroll asignada.

Durante ese intervalo, el fondo permanece estable mientras se muestra información.

Al salir de la parada comienza el video siguiente.

Las fotografías no deben desaparecer inesperadamente cuando el usuario cambia de segmento.

La transición debe ser suave, evitando saltos, parpadeos, flashes negros o fondos vacíos.

---

# 9. FONDO CONFIGURABLE POR PARADA

Todavía no está decidido si cada parada utilizará una fotografía de alta resolución o el fotograma final del video.

Implementa las tres opciones siguientes:

```ts
type StopMediaMode =
  | "video-freeze"
  | "poster-image"
  | "high-res-image";
```

`video-freeze`:
Mantiene visible el último fotograma decodificado del video.

`poster-image`:
Utiliza una imagen de respaldo extraída del video.

`high-res-image`:
Utiliza una fotografía independiente optimizada.

Permite cambiar la opción por parada mediante configuración, sin modificar componentes.

Incluye en modo desarrollo un selector para comparar las opciones en una misma escena.

Si se utiliza una fotografía de alta resolución, no debe haber cambios visibles importantes de encuadre.

Precarga la fotografía antes de sustituir el video.

Si la fotografía falla, usa el último frame disponible o el póster.

No ocultes el único recurso visual disponible antes de tener preparado el siguiente.

---

# 10. SISTEMA DE PERSONAJES VISUAL NOVEL

Las paradas deben poder presentar personajes estilo anime, inspirados en videojuegos de novela visual.

Los personajes aparecen superpuestos al fondo real del consultorio.

Su función es presentar información y orientar al visitante.

Roles previstos:

1. Recepción.
2. Odontología general.
3. Profesional de odontología especializada.
4. Auxiliar o asistente odontológico.
5. Profesional o técnico de laboratorio relacionado con moldes, retenedores y prótesis, cuando corresponda a los servicios reales.

Los avatares son representaciones ilustrativas.

No los presentes como fotografías de profesionales reales ni les atribuyas nombres, credenciales o especialidades no confirmadas.

Cada personaje debe tener:

- ID.
- Rol.
- Nombre de presentación configurable.
- Imagen PNG/WebP.
- Posición.
- Tamaño responsive.
- Animación de entrada.
- Animación de salida.
- Configuración de diálogo.
- Acciones disponibles.

Los PNG transparentes deben conservar correctamente su canal alfa.

Los personajes deben poder reemplazarse posteriormente por versiones basadas en fotografías autorizadas de las personas reales.

No hagas que el sistema dependa de dimensiones o nombres específicos de los avatares actuales.

---

# 11. INTERFAZ TIPO NOVELA VISUAL

Cuando el recorrido llegue a una parada, debe aparecer una interfaz informativa inspirada en una visual novel.

Debe poder mostrar:

- Personaje.
- Nombre o rol.
- Caja de diálogo.
- Texto informativo.
- Páginas o líneas de diálogo.
- Indicador para continuar.
- Botones comerciales.

El diseño debe ser profesional, no infantil.

La caja de diálogo puede ser translúcida, con bordes suaves y buen contraste.

Los diálogos deben almacenarse en archivos de datos.

El visitante debe poder leerlos y usar los controles sin que el scroll le quite inesperadamente el contenido.

Los controles interactivos deben funcionar con mouse, tacto y teclado.

Como comportamiento inicial:

- El personaje aparece al llegar a la parada.
- La caja de diálogo entra mediante una animación sutil.
- Se presenta la primera información.
- Si hay varias páginas, el visitante puede navegar mediante controles explícitos.
- El scroll sigue controlando el recorrido general.

No hagas que el avance de textos dependa de temporizadores obligatorios.

---

# 12. PARTÍCULAS Y EFECTOS AMBIENTALES

Cada parada debe permitir partículas opcionales.

Ejemplos:

- Destellos sutiles.
- Polvo flotante suave.
- Pequeños puntos luminosos.
- Brillos ambientales discretos.

Configuración mínima:

```ts
type ParticleConfig = {
  enabled: boolean;
  type: "dust" | "sparkle" | "soft-glow";
  density: number;
  speed: number;
  size: number;
  colors: string[];
};
```

Las partículas deben ser decorativas y no interferir con el contenido.

No deben bloquear clics.

Utiliza `pointer-events: none`.

Reduce su cantidad o desactívalas en dispositivos de bajo rendimiento.

Desactiva movimiento no esencial si el usuario tiene `prefers-reduced-motion`.

Evita crear múltiples ciclos de animación activos para escenas que no están visibles.

No añadas una dependencia pesada para un efecto que pueda resolverse eficientemente con Canvas o CSS.

---

# 13. SISTEMA DE CAPAS

Cada escena puede contener estas capas:

1. Fondo base.
2. Video.
3. Imagen estática de parada.
4. Gradiente para legibilidad.
5. Partículas.
6. Personaje.
7. Caja de diálogo.
8. Botones de acción.
9. Navegación global.

Define una jerarquía clara de `z-index`.

Evita que elementos decorativos bloqueen la navegación.

Las capas deben poder activarse o desactivarse por escena.

Debe ser posible mostrar una parada sin personaje, sin partículas o sin fotografía independiente.

---

# 14. CONTENIDO COMERCIAL

La landing debe presentar Sonríe como un establecimiento odontológico cercano y confiable.

Debajo del recorrido, o mediante acceso directo, incluye secciones de:

- Presentación del negocio.
- Servicios confirmados.
- Instalaciones.
- Información educativa.
- Ubicación.
- Contacto.
- Preguntas frecuentes.

El objetivo es que los visitantes puedan solicitar información sin completar necesariamente todo el recorrido.

Incluye un botón persistente pero discreto para WhatsApp.

El número debe ser configurable.

No inventes el número de contacto.

Los botones podrán utilizar mensajes predefinidos según el contexto de cada sección, una vez se configure el WhatsApp oficial.

---

# 15. EDUCACIÓN EN SALUD ORAL

Prepara una sección de artículos educativos que se pueda ampliar posteriormente.

Temáticas previstas:

- Cuidado de dientes de bebés.
- Higiene oral infantil.
- Salud oral de adolescentes.
- Cuidados durante la ortodoncia con brackets.
- Importancia de la limpieza dental.
- Función de las radiografías odontológicas.
- Cuidado de prótesis dentales.
- Recomendaciones generales de prevención.

Los artículos deben tener URLs independientes y ser indexables.

No publiques contenido clínico no revisado como consejo profesional definitivo.

Deja una marca editorial de pendiente de revisión cuando corresponda.

---

# 16. DISEÑO VISUAL

La identidad de la landing debe basarse en las instalaciones reales de Sonríe.

La recepción tiene:

- Superficies claras.
- Contrastes negros.
- Acabados de apariencia marmolizada.
- Iluminación blanca.
- Acentos de iluminación azul.
- Estética moderna.

Dirección artística:

- Moderna.
- Limpia.
- Elegante.
- Cinematográfica.
- Cercana.
- Profesional.
- Legible.

El recorrido debe ocupar visualmente gran parte de la pantalla.

Los personajes anime deben integrarse en la composición sin ocultar elementos importantes del consultorio.

Las cajas informativas no deben tapar innecesariamente el espacio real.

El diseño en móvil puede adaptar posiciones, tamaño y distribución de personajes.

No copies la identidad visual de Arko.

---

# 17. ORGANIZACIÓN DE DATOS

El contenido debe estar desacoplado de la lógica de animación.

Crea archivos como:

```text
src/data/
  sonrie.ts
  tour.ts
  characters.ts
  dialogues.ts
  services.ts
  contact.ts
```

Cada segmento de `tour.ts` debe permitir definir:

- ID.
- Nombre visible.
- Archivo de video.
- Póster.
- Fotografía de parada.
- Modo de fondo.
- Punto de enfoque.
- Peso de scroll del video.
- Peso de scroll de la parada.
- Personaje.
- Diálogo.
- Partículas.
- CTA.
- Siguiente segmento.

La arquitectura debe permitir reemplazar una fotografía, avatar o video modificando principalmente configuración.

Utiliza tipos TypeScript estrictos para evitar inconsistencias.

---

# 18. ESTRUCTURA TÉCNICA SUGERIDA

```text
src/
  components/
    ScrollWorld.astro
    ScrollStop.astro
    VideoLayer.astro
    StopBackground.astro
    StopOverlay.astro
    Character.astro
    DialogueBox.astro
    ParticleLayer.astro
    TourNavigation.astro
    WhatsAppCTA.astro
    ServiceSection.astro
    ContactSection.astro

  data/
    sonrie.ts
    tour.ts
    characters.ts
    dialogues.ts
    services.ts
    contact.ts

  scripts/
    world.ts
    motion.ts
    timeline.ts
    video-loader.ts
    particles.ts

  pages/
    index.astro
    contacto.astro
    servicios/
    salud-oral/

  layouts/
    Layout.astro

  styles/
    global.css
```

Es una estructura orientativa.

Puedes adaptarla para evitar componentes innecesarios o mejorar la organización.

El requisito principal es separar datos, lógica de scroll, medios audiovisuales y componentes informativos.

---

# 19. RENDIMIENTO AUDIOVISUAL

La landing debe funcionar correctamente incluso en conexiones móviles limitadas.

Implementa:

- Carga inicial mínima.
- Precarga del video actual.
- Precarga controlada del siguiente video.
- Pósters optimizados.
- Imágenes responsive.
- WebP/AVIF cuando sea apropiado.
- Liberación de Blob URLs que ya no se necesiten.
- Control de memoria.
- Fallback ante errores.
- Animaciones eficientes.
- Evitar trabajo excesivo en cada evento de scroll.

Verifica que los MP4 permitan realizar búsquedas fluidas por `currentTime`.

El repositorio de Midudev utiliza fotogramas clave frecuentes, aproximadamente cada seis frames, para mejorar el scrubbing.

Analiza el GOP de los videos existentes antes de decidir si requieren una nueva codificación.

No recomprimas innecesariamente archivos que ya funcionen correctamente.

Si necesitan recodificación, documenta parámetros, impacto en calidad y tamaño final.

Evita cargar simultáneamente todos los videos sin justificación.

Utiliza `requestAnimationFrame` donde corresponda y gestiona las operaciones de seek evitando solicitudes redundantes.

---

# 20. COMPATIBILIDAD Y ACCESIBILIDAD

Prueba o prepara verificaciones para:

- Chrome.
- Edge.
- Firefox.
- Safari.
- iPhone.
- Android.

Considera:

- `prefers-reduced-motion`.
- Ahorro de datos.
- Navegación por teclado.
- Contraste de textos.
- Uso táctil.
- Viewports pequeños.
- Variaciones de orientación.
- Errores de descarga.
- Dispositivos de rendimiento limitado.

Para usuarios que no puedan o no quieran utilizar animaciones, prepara una versión de navegación estática entre espacios y servicios.

La información comercial debe permanecer accesible sin depender de que los videos funcionen.

---

# 21. SEO LOCAL

La web debe estar preparada para posicionamiento local de Sonríe en Urrao.

Implementa:

- HTML semántico.
- Títulos correctos.
- Metadescripciones.
- Open Graph.
- Imagen social.
- Canonical.
- Sitemap.
- Robots.txt.
- Datos estructurados apropiados para la actividad confirmada.
- Contenido indexable.
- URLs descriptivas.
- Navegación interna.

No utilices automáticamente el esquema de restaurante del proyecto Arko.

No inventes reseñas ni calificaciones.

No publiques servicios que todavía no estén confirmados o habilitados.

---

# 22. MEMORIA PERSISTENTE DEL PROYECTO

Este proyecto se desarrollará a través de varias sesiones de Codex.

No debe depender exclusivamente de la memoria de una conversación.

Crea y mantén:

```text
AGENTS.md

docs/
  REQUIREMENTS.md
  PROGRESS.md
  DECISIONS.md
  MEDIA.md
  CHANGELOG.md
```

Funciones de cada archivo:

**AGENTS.md**

Instrucciones permanentes para Codex:
- Cómo iniciar el trabajo.
- Qué documentación leer.
- Estándares técnicos.
- Cómo verificar cambios.
- Cómo actualizar progreso.

**REQUIREMENTS.md**

Requisitos completos de Sonríe. Debe contener la especificación inicial y sus actualizaciones aprobadas.

**PROGRESS.md**

Registro de tareas, fases, estados y verificaciones.

**DECISIONS.md**

Decisiones de arquitectura y sus motivos.

**MEDIA.md**

Inventario de archivos, rutas definitivas, correspondencia de videos con escenas, fotografías, personajes y recursos faltantes.

**CHANGELOG.md**

Historial de cambios funcionales importantes.

Estos archivos deben mantenerse versionados mediante Git.

---

# 23. PROTOCOLO PARA CADA SESIÓN

Antes de comenzar cualquier nueva tarea:

1. Lee `AGENTS.md`.
2. Consulta `docs/REQUIREMENTS.md`.
3. Revisa `docs/PROGRESS.md`.
4. Consulta decisiones técnicas relevantes.
5. Comprueba el estado del código.
6. Inspecciona los recursos disponibles.
7. Identifica la próxima tarea prioritaria.

No asumas que la documentación siempre coincide con el código.

Comprueba las discrepancias y registra las correcciones necesarias.

Al terminar cada tarea:

1. Verifica su funcionamiento.
2. Ejecuta pruebas aplicables.
3. Ejecuta build cuando corresponda.
4. Actualiza el progreso.
5. Registra decisiones técnicas importantes.
6. Actualiza el inventario de medios si cambió.
7. Actualiza el changelog cuando corresponda.
8. Resume el trabajo realizado y los pendientes.

Nunca marques una tarea como terminada si no ha superado sus verificaciones esenciales.

---

# 24. SISTEMA DE SEGUIMIENTO

Cada tarea debe contener:

- Identificador.
- Nombre.
- Descripción.
- Estado.
- Archivos afectados.
- Dependencias.
- Criterio de aceptación.
- Resultado de pruebas.
- Observaciones.

Estados permitidos:

```text
PENDING
IN_PROGRESS
COMPLETED
BLOCKED
NEEDS_REVIEW
```

`PROGRESS.md` debe incluir un resumen general y una tabla o checklist por fase.

Cuando existan nuevas solicitudes del usuario, actualiza requisitos, prioridades y decisiones antes de modificar sustancialmente la implementación.

No elimines requisitos anteriores sin autorización.

---

# 25. FASES DEL DESARROLLO

Trabaja por incrementos verificables.

## Fase 1 — Preparación

- Inspeccionar repositorio.
- Analizar referencia de Midudev.
- Crear proyecto Astro.
- Configurar dependencias.
- Crear documentación persistente.
- Inventariar recursos reales.

## Fase 2 — Motor de recorrido

- Stage sticky.
- GSAP ScrollTrigger.
- Lenis.
- Sincronización con video.
- Scroll bidireccional.
- Timeline configurable.

## Fase 3 — Paradas con imagen

- Video congelado.
- Imagen póster.
- Fotografía de alta resolución.
- Transiciones.
- Scroll de permanencia.
- Retorno bidireccional.

## Fase 4 — Integración audiovisual

- Incorporar cinco videos.
- Verificar duraciones.
- Comparar imágenes.
- Asignar escenas.
- Comprobar continuidad.
- Optimizar carga.

## Fase 5 — Personajes visual novel

- Registrar los PNG.
- Identificar roles.
- Renderizar personajes.
- Añadir animaciones.
- Implementar diálogos.
- Adaptar a móvil.

## Fase 6 — Partículas

- Motor ligero.
- Configuración por parada.
- Animación eficiente.
- Opciones de accesibilidad.

## Fase 7 — Diseño comercial

- Diseño final.
- Servicios.
- Contacto.
- WhatsApp.
- Navegación alternativa.
- Ubicación.

## Fase 8 — Contenido educativo y SEO

- Estructura editorial.
- Páginas informativas.
- Metadatos.
- Sitemap.
- Datos estructurados.

## Fase 9 — Optimización y pruebas

- Rendimiento.
- Móvil.
- Navegadores.
- Accesibilidad.
- Revisión de errores.
- Build de producción.

## Fase 10 — Entrega

- README.
- Instrucciones de recursos.
- Configuración.
- Documentación de despliegue.
- Revisión final.

No avances una fase como completada sin verificar sus criterios de aceptación.

Puedes preparar código de fases posteriores cuando sea necesario, pero mantén el seguimiento fiel al progreso real.

---

# 26. CRITERIOS DE ACEPTACIÓN DEL MVP

El MVP técnico estará listo cuando:

1. Astro funcione localmente.
2. El motor de scroll sea bidireccional.
3. Los cinco videos estén integrados o preparados mediante placeholders si aún no están disponibles.
4. Cada video pueda finalizar en una parada.
5. Cada parada soporte fondo configurable.
6. Se pueda continuar al siguiente video.
7. Se pueda retroceder al anterior.
8. La transición visual evite saltos innecesarios.
9. El sistema permita mostrar personajes.
10. El diálogo sea funcional.
11. Las partículas puedan activarse y desactivarse.
12. Las escenas sean configurables mediante datos.
13. Exista navegación alternativa.
14. Exista CTA de contacto configurable.
15. La versión móvil sea usable.
16. El build se complete correctamente.
17. El progreso y los requisitos estén documentados.

No declares comprobada una funcionalidad que no hayas probado.

---

# 27. DEPURACIÓN Y HERRAMIENTAS DE DESARROLLO

Agrega un modo de depuración disponible solamente en desarrollo.

Debe mostrar información como:

- Segmento activo.
- Video seleccionado.
- Tiempo actual.
- Duración.
- Progreso de scroll.
- Estado de carga.
- Modo de fondo.
- Parada activa.
- Personaje activo.
- Partículas activas.
- Errores de medios.

Permite comparar en desarrollo los tres modos de fondo de una parada.

Esto facilitará revisar si es mejor conservar el último fotograma del video o utilizar su fotografía.

El panel debe poder ocultarse y nunca aparecer en producción.

---

# 28. CONTROL DE CAMBIOS Y SEGURIDAD

Utiliza Git para preservar el trabajo.

No borres recursos originales sin autorización.

No reemplaces archivos definitivos con contenido inventado.

No realices despliegues públicos, operaciones destructivas ni publiques información comercial no validada sin aprobación.

No realices commits o pushes automáticos salvo que el flujo autorizado del repositorio lo permita explícitamente.

No incluyas secretos ni credenciales dentro del código.

Si un recurso pesa demasiado para Git, documenta una estrategia de almacenamiento adecuada sin perder la referencia de su ubicación.

---

# 29. ENTREGABLES POR SESIÓN

Al finalizar cada intervención informa:

- Qué implementaste.
- Qué archivos cambiaste.
- Qué pruebas ejecutaste.
- Qué pasó y qué falló.
- Qué quedó pendiente.
- Qué archivos o datos faltan.
- Cuál es la siguiente tarea recomendada.

Actualiza los archivos de documentación antes de concluir.

Si recibes posteriormente la instrucción:

"Continúa el proyecto Sonríe"

Debes leer la documentación persistente, revisar el estado real del repositorio y continuar desde la siguiente tarea del plan.

---

# 30. PRIMERA EJECUCIÓN OBLIGATORIA

Comienza ahora.

Orden de trabajo inicial:

1. Revisa el estado del repositorio actual.
2. Analiza el proyecto de Midudev.
3. Identifica los assets de Sonríe que realmente estén disponibles.
4. Crea `AGENTS.md` y los documentos de memoria.
5. Transcribe esta especificación a `docs/REQUIREMENTS.md` sin perder requisitos.
6. Prepara `docs/MEDIA.md` con el inventario confirmado y los archivos faltantes.
7. Crea un plan de tareas verificables en `docs/PROGRESS.md`.
8. Inicializa o adapta el proyecto Astro.
9. Instala y configura las dependencias.
10. Implementa una primera versión funcional del motor scroll-world.
11. Prepara la estructura para las cinco paradas con fondo configurable.
12. Ejecuta verificaciones y build.
13. Actualiza la documentación con el resultado real.

No intentes finalizar todas las fases en la primera ejecución si ello compromete la calidad.

En esta primera tarea prioriza dejar funcionando la base técnica y establecer correctamente el sistema de continuidad documental.

**No respondas solamente con un plan. Comienza a implementar y registra el progreso.**
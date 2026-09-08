# Auditoría integral de Pulso Study

Fecha de revisión: 7 de septiembre de 2026.

## Contenido académico y dificultad

- Banco inicial: 180 preguntas, 60 por presentación.
- Distribución por módulo: 10 Fácil, 10 Media, 20 Difícil y 20 Examen.
- Difícil y Examen pueden entregar 40 preguntas sin usar contenido Fácil.
- Se reescribieron 60 preguntas avanzadas y se añadieron 60 retos de síntesis doble.
- Las operaciones cognitivas incluyen clasificación múltiple, comparación, secuencias, relación estructura-función, análisis causal, diagnóstico diferencial, casos clínicos y evaluación de enunciados.
- El contenido se limita a los tres PDFs fuente. El módulo cardiovascular incorpora además hematopoyesis, eritropoyetina, componentes sanguíneos y clasificación de anemias presentes en su presentación.

## Motor de cuestionarios

- Límite por sesión: 1 a 40 preguntas exactas.
- No se repiten identificadores ni enunciados dentro de una sesión.
- Seleccionar un módulo aplica un filtro estricto; nunca se completa la cantidad mezclando otros temas.
- Fácil, Media, Difícil y Examen usan bancos y progresiones diferentes.
- Las cuatro opciones cambian de posición en cada intento sin alterar la respuesta correcta.
- El modo Estudio conserva explicación inmediata; el modo Reto conserva puntos adicionales por racha.

## Progreso y rachas

- La racha actual aumenta solo con respuestas consecutivas correctas y vuelve a cero al fallar.
- La mejor racha permanece guardada aunque la racha actual se reinicie.
- El dominio combina precisión con cobertura del tema. Una sola respuesta correcta ya no puede producir 100%.
- Un módulo solo se considera completado después de estudiar 40 preguntas únicas del propio módulo.
- Los módulos no estudiados permanecen en 0% y no reciben progreso indirecto.

## Flashcards y repaso continuo

- Cada pregunta puede convertirse en flashcard; no existe un límite global de tarjetas.
- Las tarjetas se desbloquean al ver conceptos y al completar el módulo correspondiente.
- Quiz y flashcards comparten un calendario de repetición espaciada.
- El repaso combina errores reales y tarjetas vencidas.
- Los indicadores permanecen ocultos cuando no existen elementos pendientes.

## PDFs añadidos

- El procesamiento se realiza localmente con PDF.js; el archivo no se envía a un servidor.
- Cada PDF nuevo crea 60 preguntas con la misma distribución cognitiva del banco inicial.
- El texto se reconstruye por líneas y posición para reducir frases cortadas en diapositivas.
- Incluso un PDF corto puede sostener sesiones exactas de hasta 40 preguntas distintas.
- La generación automática es una ayuda de estudio y debe revisarse antes de utilizarse como evaluación formal.

## Interfaz, accesibilidad y respuesta móvil

- Navegación principal identificada para tecnologías de asistencia.
- Estado activo comunicado con `aria-current`; selectores con `aria-pressed`.
- Barra de avance expuesta como `progressbar`.
- Resultado y explicación comunicados mediante regiones vivas.
- Foco visible de alto contraste.
- Atajos A-D o 1-4 para responder y Enter para continuar.
- Controles decorativos sin acción dejaron de anunciarse como botones.
- Preguntas extensas permiten saltos de línea y ajuste de palabras.
- Diseño verificado a 390 x 844 px: navegación inferior, tarjetas, estadísticas y cuestionarios permanecen utilizables.
- Se respeta `prefers-reduced-motion`.

## Persistencia, privacidad y ejecución

- Progreso, historial, errores, rachas y módulos personales permanecen en el navegador mediante almacenamiento local.
- No requiere cuentas, claves externas ni servicios de inteligencia artificial.
- Incluye servidor local, script de pruebas y documentación de arranque.

## Matriz de verificación

| Área | Verificación | Resultado |
| --- | --- | --- |
| Banco inicial | 180 IDs y textos únicos | Aprobado |
| Tema | 40/40 preguntas del módulo elegido | Aprobado |
| Dificultad | 40 Difícil/Examen sin preguntas fáciles | Aprobado |
| Opciones | Respuesta preservada tras aleatorización | Aprobado |
| Cantidad | 1-40 exactas; prueba completa con 40 | Aprobado |
| Racha | Reinicio actual y conservación del máximo | Aprobado |
| Dominio | Precisión multiplicada por cobertura | Aprobado |
| Flashcards | Solo se desbloquea el tema estudiado | Aprobado |
| PDF local | 60 preguntas y 40 difíciles disponibles | Aprobado |
| Teclado | A-D, 1-4 y Enter | Aprobado |
| Móvil | 390 x 844 px | Aprobado |
| Errores de consola | Ninguno en los recorridos | Aprobado |

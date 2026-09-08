# Pulso Study

Aplicación de estudio local inspirada en la energía de Kahoot y la claridad de Quizlet. Incluye dashboard, progreso por tema, quiz con puntos y racha, modo estudio, historial, repaso de errores, dificultad, número de preguntas y carga local de PDFs.

## Aprendizaje continuo

- Incluye 180 preguntas iniciales: 60 por cada presentación y 120 de nivel Difícil o Examen.
- Cada quiz admite hasta 40 preguntas únicas, sin repeticiones.
- Al seleccionar una presentación, el examen usa exclusivamente preguntas de ese tema.
- Los PDFs añadidos generan un banco local de 60 preguntas, incluso cuando el archivo tiene pocas oraciones detectables.
- La racha actual se reinicia al fallar; la mejor racha alcanzada se conserva en el perfil y el historial.
- La dificultad no es solo una etiqueta: Difícil usa análisis multiconcepto y Examen usa casos, secuencias y síntesis dobles.
- Hay suficientes preguntas avanzadas para completar 40 preguntas Difíciles o 40 de Examen sin recurrir a contenido fácil.
- Las opciones cambian de posición en cada intento para evitar aprendizaje por ubicación.
- Las flashcards se desbloquean conforme aparecen preguntas en los quizzes y al completar temas.
- Quiz y flashcards alimentan un mismo calendario de repetición espaciada.
- Los avisos solo aparecen cuando existen errores o tarjetas realmente pendientes.
- Los PDFs añadidos pueden crear nuevos módulos y flashcards sin un límite fijo de tarjetas.

## Ejecutar

Requiere Node.js 18 o posterior. No necesita instalar dependencias ni usar claves.

```bash
npm start
```

Abre `http://localhost:4173`.

## Probar

```bash
npm test
```

## Datos y privacidad

- Las 180 preguntas iniciales se redactaron exclusivamente con los tres PDFs proporcionados.
- Progreso, historial, módulos y errores se conservan en `localStorage` del navegador.
- Los PDFs nuevos se procesan dentro del navegador usando PDF.js; no se suben a ningún servidor.
- La generación local extrae afirmaciones y crea niveles de recuerdo, aplicación, análisis doble y síntesis. Conviene revisar el material generado antes de usarlo en un examen formal.

## Arquitectura de generación

`data.js` compone el banco inicial y los retos de síntesis; `advanced-questions.js` contiene los casos y preguntas de razonamiento; `quiz-engine.js` aísla temas, separa niveles y reorganiza opciones; `pdf-question-generator.js` procesa módulos locales; y `app.js` coordina interfaz, progreso y repetición espaciada.

Cada pregunta usa: `id`, `module`, `difficulty`, `text`, cuatro `options`, índice `answer`, `explanation` y, cuando corresponde, `skill` para describir la operación cognitiva evaluada.

# Pulso Study

Aplicación de estudio local inspirada en la energía de Kahoot y la claridad de Quizlet. Incluye dashboard, progreso por tema, quiz con puntos y racha, modo estudio, historial, repaso de errores, dificultad, número de preguntas y carga local de PDFs.

## Aprendizaje continuo

- Incluye 120 preguntas iniciales: 40 por cada presentación.
- Cada quiz admite hasta 40 preguntas únicas, sin repeticiones.
- Al seleccionar una presentación, el examen usa exclusivamente preguntas de ese tema.
- Tema y dificultad se usan como prioridades; una sesión larga se completa con contenido complementario.
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

- Las 120 preguntas iniciales se redactaron exclusivamente con los tres PDFs proporcionados.
- Progreso, historial, módulos y errores se conservan en `localStorage` del navegador.
- Los PDFs nuevos se procesan dentro del navegador usando PDF.js; no se suben a ningún servidor.
- La generación local incluida es deliberadamente básica: extrae afirmaciones y crea preguntas preliminares. Conviene revisarlas antes de usarlas en un examen formal.

## Arquitectura de generación

`data.js` contiene el banco inicial. La función `upload()` de `app.js` implementa el adaptador local actual. Para integrar un generador avanzado, sustituye esa función por un adaptador que devuelva objetos con: `id`, `module`, `difficulty`, `text`, cuatro `options`, índice `answer` y `explanation`.

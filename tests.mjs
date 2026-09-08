import assert from 'node:assert/strict';
import {seedModules,seedQuestions} from './data.js';
import {advancedOverrides} from './advanced-questions.js';
import {buildAdaptiveQuestionSet,buildQuestionSet,calculateMastery,scheduleCard,updateStreak} from './quiz-engine.js';
import {generatePdfQuestions,reconstructPageText,upgradeCustomModule} from './pdf-question-generator.js';

assert.equal(seedModules.length,3);
assert.equal(seedQuestions.length,180);
assert.equal(Object.keys(advancedOverrides).length,60);
for(const question of seedQuestions){
  assert.ok(seedModules.some(module=>module.id===question.module),question.id);
  assert.equal(question.options.length,4,question.id);
  assert.ok(question.answer>=0&&question.answer<4,question.id);
  assert.ok(question.explanation.length>15,question.id);
}
assert.equal(new Set(seedQuestions.map(question=>question.id)).size,seedQuestions.length);
assert.equal(new Set(seedQuestions.map(question=>question.text)).size,seedQuestions.length);
console.log('✓ 180 preguntas únicas y 60 retos avanzados validados');

for(const module of seedModules){
  const pool=seedQuestions.filter(question=>question.module===module.id);
  assert.equal(pool.length,60,module.id);
  assert.deepEqual(['easy','medium','hard','exam'].map(level=>pool.filter(question=>question.difficulty===level).length),[10,10,20,20]);
  const full=buildQuestionSet(pool,40,()=>.42);
  assert.equal(full.length,40);
  assert.equal(new Set(full.map(question=>question.id)).size,40);
  assert.ok(full.every(question=>question.module===module.id));
  const original=new Map(pool.map(question=>[question.id,question.options[question.answer]]));
  assert.ok(full.every(question=>question.options[question.answer]===original.get(question.id)));
}
console.log('✓ Cada tema conserva aislamiento, respuestas correctas y sesiones exactas de 40');

const cardio=seedQuestions.filter(question=>question.module==='cardio');
const easy20=buildAdaptiveQuestionSet(cardio,20,{module:'cardio',difficulty:'easy'},()=>.42);
const medium20=buildAdaptiveQuestionSet(cardio,20,{module:'cardio',difficulty:'medium'},()=>.42);
const hard20=buildAdaptiveQuestionSet(cardio,20,{module:'cardio',difficulty:'hard'},()=>.42);
const exam20=buildAdaptiveQuestionSet(cardio,20,{module:'cardio',difficulty:'exam'},()=>.42);
assert.ok(easy20.slice(0,10).every(question=>question.difficulty==='easy'));
assert.ok(easy20.slice(10).every(question=>question.difficulty==='medium'));
assert.ok(medium20.slice(0,10).every(question=>question.difficulty==='medium'));
assert.ok(medium20.slice(10).every(question=>question.difficulty==='hard'));
assert.ok(hard20.every(question=>question.difficulty==='hard'));
assert.ok(exam20.every(question=>question.difficulty==='exam'));
assert.equal(hard20.filter(question=>easy20.some(easy=>easy.id===question.id)).length,0);
const hard40=buildAdaptiveQuestionSet(cardio,40,{module:'cardio',difficulty:'hard'},()=>.42);
const exam40=buildAdaptiveQuestionSet(cardio,40,{module:'cardio',difficulty:'exam'},()=>.42);
const medium40=buildAdaptiveQuestionSet(cardio,40,{module:'cardio',difficulty:'medium'},()=>.42);
assert.deepEqual([...new Set(hard40.map(question=>question.difficulty))],['hard','exam']);
assert.deepEqual([...new Set(exam40.map(question=>question.difficulty))],['exam','hard']);
assert.ok(medium40.every(question=>question.difficulty!=='easy'));
console.log('✓ Fácil, Media, Difícil y Examen tienen bancos cognitivos separados hasta 40 preguntas');

const advanced=seedQuestions.filter(question=>['hard','exam'].includes(question.difficulty));
assert.ok(advanced.filter(question=>question.skill).length>=120);
assert.ok(advanced.some(question=>/hipoxia|eritropoyetina/i.test(question.text)));
assert.ok(advanced.some(question=>/simultáneamente|evalúa|ordena/i.test(question.text)));
console.log('✓ Los niveles altos incluyen secuencias, integración, diagnóstico diferencial y casos clínicos');

assert.equal(buildQuestionSet(seedQuestions.slice(0,7),20,()=>.42).length,7);
assert.equal(buildAdaptiveQuestionSet(seedQuestions,40,{module:'signos',difficulty:'hard'},()=>.42).length,40);
assert.equal(buildAdaptiveQuestionSet([...seedQuestions,seedQuestions[0]],99).length,40);
console.log('✓ El límite sigue siendo 40 y nunca introduce preguntas repetidas');

const now=1700000000000;
assert.equal(scheduleCard({},'again',now).due,now+60000);
assert.equal(scheduleCard({},'good',now).interval,3);
assert.equal(scheduleCard({interval:7,repetitions:2},'easy',now).interval,21);
const generated=generatePdfQuestions({moduleId:'pdf-test',title:'Archivo breve',source:['La salud integra factores biológicos, psicológicos y sociales que se relacionan entre sí.'],count:60,random:()=>.25});
assert.equal(generated.length,60);
assert.deepEqual(['easy','medium','hard','exam'].map(level=>generated.filter(question=>question.difficulty===level).length),[10,10,20,20]);
assert.equal(new Set(generated.map(question=>question.id)).size,60);
assert.equal(new Set(generated.map(question=>question.text)).size,60);
assert.ok(generated.every(question=>question.options.length===4&&question.answer>=0));
assert.equal(upgradeCustomModule({id:'old',title:'Anterior',questions:generated.slice(0,9)}).questions.length,60);
assert.equal(reconstructPageText([{str:'izquierda',transform:[1,0,0,1,10,100]},{str:'derecha',transform:[1,0,0,1,80,100]},{str:'segunda línea',transform:[1,0,0,1,10,80]}]),'izquierda derecha\nsegunda línea');
console.log('✓ Flashcards, repetición espaciada y PDFs cortos conservan su comportamiento');

let streak={current:0,best:0};
for(const correct of [true,true,true,false,true,true,false])streak=updateStreak(streak.current,streak.best,correct);
assert.deepEqual(streak,{current:0,best:3});
assert.deepEqual(updateStreak(2,5,true),{current:3,best:5});
console.log('✓ La racha actual y la mejor racha siguen calculándose correctamente');

assert.equal(calculateMastery({correct:1,total:1,seen:1,target:40}),3);
assert.equal(calculateMastery({correct:32,total:40,seen:40,target:40}),80);
assert.equal(calculateMastery({correct:40,total:40,seen:20,target:40}),50);
console.log('✓ El dominio combina precisión y cobertura; una sola respuesta ya no muestra 100%');

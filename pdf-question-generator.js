const clean=value=>String(value||'').replace(/\s+/g,' ').replace(/^[•·–—-]+\s*/,'').trim();
const unique=items=>[...new Map(items.filter(Boolean).map(item=>[item.toLocaleLowerCase('es'),item])).values()];

export function reconstructPageText(items=[]){
  const rows=[];
  for(const item of items){
    const text=clean(item?.str);if(!text)continue;
    const x=Number(item?.transform?.[4]||0),y=Number(item?.transform?.[5]||0);
    let row=rows.find(candidate=>Math.abs(candidate.y-y)<2);
    if(!row){row={y,cells:[]};rows.push(row)}
    row.cells.push({x,text});
  }
  return rows.sort((a,b)=>b.y-a.y).map(row=>row.cells.sort((a,b)=>a.x-b.x).map(cell=>cell.text).join(' ')).join('\n');
}

function wordChunks(text,size=24){
  const words=clean(text).split(' ').filter(Boolean),chunks=[];
  for(let index=0;index<words.length;index+=size)chunks.push(words.slice(index,index+size).join(' '));
  return chunks.filter(chunk=>chunk.length>=30);
}

export function collectStudyStatements(source){
  const fragments=(Array.isArray(source)?source:[source]).map(clean).filter(Boolean);
  const joined=fragments.join('\n');
  const sentenceUnits=joined.split(/(?<=[.!?])\s+|[\n;•]+/).map(clean).flatMap(unit=>unit.length>260?wordChunks(unit):[unit]).filter(unit=>unit.length>=30&&unit.length<=260);
  const chunkUnits=wordChunks(fragments.join(' '));
  const candidates=unique([...sentenceUnits,...chunkUnits]);
  if(candidates.length)return candidates.slice(0,160);
  const fallback=clean(joined);
  return fallback?[fallback.slice(0,260)]:[];
}

function shuffledOptions(correct,distractors,random){
  const options=unique([correct,...distractors]);
  while(options.length<4)options.push(`Opción no respaldada ${options.length}`);
  for(let index=options.length-1;index>0;index--){const other=Math.floor(random()*(index+1));[options[index],options[other]]=[options[other],options[index]]}
  return{options:options.slice(0,4),answer:options.slice(0,4).indexOf(correct)};
}

function completion(unit){
  const words=unit.split(' '),cut=Math.max(4,Math.floor(words.length*.55));
  return{start:words.slice(0,cut).join(' '),end:words.slice(cut).join(' ')};
}

export function generatePdfQuestions({moduleId,title,source,count=60,random=Math.random}){
  const statements=collectStudyStatements(source),total=Math.min(60,Math.max(1,Number(count)||60));
  if(!statements.length)return[];
  return Array.from({length:total},(_,index)=>{
    const statement=statements[index%statements.length],second=statements[(index+7)%statements.length],number=index+1,difficulty=index<10?'easy':index<20?'medium':index<40?'hard':'exam';
    let text,correct,distractors,skill;
    if(difficulty==='medium'){
      const parts=completion(statement);
      if(parts.end){
        text=`Completa la idea ${number} de “${title}”: «${parts.start}…»`;
        correct=parts.end;
        distractors=['no guarda relación con el contenido estudiado.','es reemplazado por una conclusión opuesta.','no aparece desarrollado en este documento.'];
      }else{
        text=`¿Qué afirmación corresponde a la idea ${number} de “${title}”?`;
        correct=statement;
        distractors=['El documento niega este contenido.','El tema se limita a una idea opuesta.','Esta afirmación pertenece a otro documento.'];
      }
      skill='Aplicación y completado';
    }else if(difficulty==='hard'){
      text=`Análisis ${number} de “${title}”. ¿Qué valoración conjunta coincide con el archivo?\nI) ${statement}\nII) ${second}`;
      correct='Las ideas I y II están respaldadas por el documento.';
      distractors=['Solo la idea I está respaldada.','Solo la idea II está respaldada.','Ninguna de las dos ideas está respaldada.'];
      skill='Análisis de dos conceptos';
    }else if(difficulty==='exam'){
      text=`Síntesis de examen ${number}. Integra estos dos fragmentos de “${title}”:\nI) ${statement}\nII) ${second}`;
      correct=`I: ${statement} · II: ${second}`;
      distractors=[`I: ${statement} · II: El documento afirma lo contrario.`,`I: El archivo niega esta idea. · II: ${second}`,'I y II pertenecen a contenidos ajenos al archivo.'];
      skill='Síntesis de examen';
    }else{
      text=`¿Cuál afirmación fue extraída de “${title}”? · Concepto ${number}`;
      correct=statement;
      distractors=['Esta afirmación no aparece en el documento.','El documento sostiene una idea opuesta.','Este concepto pertenece a otro tema.'];
      skill='Recuerdo guiado';
    }
    const choice=shuffledOptions(correct,distractors,random);
    return{id:`${moduleId}-${index}`,module:moduleId,difficulty,text,options:choice.options,answer:choice.answer,explanation:`Contenido extraído localmente del PDF: ${statement}${second!==statement?` Además: ${second}`:''}`,sourceText:statement,skill};
  });
}

export function upgradeCustomModule(module){
  const source=(module.studyStatements?.length?module.studyStatements:(module.questions||[]).map(question=>question.sourceText||question.explanation?.replace(/^Texto extraído localmente:\s*/,'')||question.options?.[question.answer])).filter(Boolean);
  if(!source.length)return module;
  return{...module,generatorVersion:3,studyStatements:collectStudyStatements(source),questions:generatePdfQuestions({moduleId:module.id,title:module.title,source,count:60})};
}

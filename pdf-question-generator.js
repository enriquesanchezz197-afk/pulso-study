const levels=['easy','medium','hard','exam'];

const clean=value=>String(value||'').replace(/\s+/g,' ').replace(/^[•·–—-]+\s*/,'').trim();
const unique=items=>[...new Map(items.filter(Boolean).map(item=>[item.toLocaleLowerCase('es'),item])).values()];

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

export function generatePdfQuestions({moduleId,title,source,count=40,random=Math.random}){
  const statements=collectStudyStatements(source),total=Math.min(40,Math.max(1,Number(count)||40));
  if(!statements.length)return[];
  return Array.from({length:total},(_,index)=>{
    const statement=statements[index%statements.length],round=Math.floor(index/statements.length)%4,number=index+1;
    let text,correct,distractors;
    if(round===1){
      text=`Según “${title}”, ¿cómo debe valorarse esta idea? · Comprobación ${number} «${statement}»`;
      correct='Está respaldada por el documento.';
      distractors=['El documento afirma exactamente lo contrario.','Pertenece a otro material y no a este tema.','El documento indica que es un concepto inexistente.'];
    }else if(round===2){
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
    }else if(round===3){
      text=`En el repaso ${number} de “${title}”, ¿qué contenido está respaldado por el archivo?`;
      correct=statement;
      distractors=['El archivo sostiene una conclusión contraria.','El material no trata ningún concepto relacionado.','La presentación sustituye el tema por otro no mencionado.'];
    }else{
      text=`¿Cuál afirmación fue extraída de “${title}”? · Concepto ${number}`;
      correct=statement;
      distractors=['Esta afirmación no aparece en el documento.','El documento sostiene una idea opuesta.','Este concepto pertenece a otro tema.'];
    }
    const choice=shuffledOptions(correct,distractors,random);
    return{id:`${moduleId}-${index}`,module:moduleId,difficulty:levels[index%levels.length],text,options:choice.options,answer:choice.answer,explanation:`Contenido extraído localmente del PDF: ${statement}`,sourceText:statement};
  });
}

export function upgradeCustomModule(module){
  const source=(module.studyStatements?.length?module.studyStatements:(module.questions||[]).map(question=>question.sourceText||question.explanation?.replace(/^Texto extraído localmente:\s*/,'')||question.options?.[question.answer])).filter(Boolean);
  if(!source.length)return module;
  return{...module,generatorVersion:2,studyStatements:collectStudyStatements(source),questions:generatePdfQuestions({moduleId:module.id,title:module.title,source,count:40})};
}

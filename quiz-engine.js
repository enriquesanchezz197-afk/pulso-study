const levelRank={easy:0,medium:1,hard:2,exam:3};

export function buildAdaptiveQuestionSet(pool,count,{module='all',difficulty='all'}={},random=Math.random){
  if(!Array.isArray(pool)||!pool.length||count<1)return[];
  const unique=[...new Map(pool.map(question=>[question.id,question])).values()];
  const target=levelRank[difficulty];
  return unique.map(question=>{
    let priority=random();
    if(module!=='all'&&question.module===module)priority+=100;
    if(difficulty!=='all'){
      const distance=Math.abs((levelRank[question.difficulty]??1)-target);
      priority+=1000-distance*200;
    }
    return{question,priority};
  }).sort((a,b)=>b.priority-a.priority).slice(0,Math.min(count,40,unique.length)).map(({question},index)=>({...question,runId:`${question.id}-${index}`}));
}

export const buildQuestionSet=(pool,count,random=Math.random)=>buildAdaptiveQuestionSet(pool,count,{},random);

export function updateStreak(current,best,correct){
  const next=correct?Math.max(0,current)+1:0;
  return{current:next,best:Math.max(Math.max(0,best),next)};
}

export function scheduleCard(previous={},rating,now=Date.now()){
  const oldInterval=previous.interval||0;let interval;
  if(rating==='again')interval=1/1440;
  else if(rating==='hard')interval=Math.max(1,Math.round(oldInterval*1.5)||1);
  else if(rating==='good')interval=Math.max(3,Math.round(oldInterval*2.3)||3);
  else interval=Math.max(7,Math.round(oldInterval*3)||7);
  return{interval,repetitions:rating==='again'?0:(previous.repetitions||0)+1,due:now+interval*86400000,lastRating:rating};
}

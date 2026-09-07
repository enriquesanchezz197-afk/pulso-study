const levelRank={easy:0,medium:1,hard:2,exam:3};
const levelOrder={
  easy:['easy','medium','hard','exam'],
  medium:['medium','hard','easy','exam'],
  hard:['hard','exam','medium','easy'],
  exam:['exam','hard','medium','easy']
};

function shuffled(items,random){
  const result=[...items];
  for(let index=result.length-1;index>0;index--){const other=Math.floor(random()*(index+1));[result[index],result[other]]=[result[other],result[index]]}
  return result;
}

export function buildAdaptiveQuestionSet(pool,count,{module='all',difficulty='all'}={},random=Math.random){
  if(!Array.isArray(pool)||!pool.length||count<1)return[];
  const unique=[...new Map(pool.map(question=>[question.id,question])).values()];
  const scoped=module==='all'?unique:unique.filter(question=>question.module===module);
  const ordered=difficulty==='all'?shuffled(scoped,random):(levelOrder[difficulty]||levelOrder.medium).flatMap(level=>shuffled(scoped.filter(question=>question.difficulty===level),random));
  return ordered.slice(0,Math.min(count,40,scoped.length)).map((question,index)=>({...question,runId:`${question.id}-${index}`}));
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

export function buildQuestionSet(pool, count, random = Math.random) {
  if (!Array.isArray(pool) || pool.length === 0 || count < 1) return [];
  const result = [];
  let previousId = null;
  while (result.length < count) {
    const batch = [...pool].sort(() => random() - 0.5);
    if (batch.length > 1 && batch[0].id === previousId) [batch[0], batch[1]] = [batch[1], batch[0]];
    for (const question of batch) {
      if (result.length >= count) break;
      result.push({...question, runId: `${question.id}-${result.length}`});
      previousId = question.id;
    }
  }
  return result;
}

export function scheduleCard(previous = {}, rating, now = Date.now()) {
  const oldInterval = previous.interval || 0;
  let interval;
  if (rating === 'again') interval = 1 / 1440;
  else if (rating === 'hard') interval = Math.max(1, Math.round(oldInterval * 1.5) || 1);
  else if (rating === 'good') interval = Math.max(3, Math.round(oldInterval * 2.3) || 3);
  else interval = Math.max(7, Math.round(oldInterval * 3) || 7);
  return {interval,repetitions:rating === 'again' ? 0 : (previous.repetitions || 0) + 1,due:now + interval * 86400000,lastRating:rating};
}

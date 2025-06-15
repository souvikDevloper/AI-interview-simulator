export async function createSession(db) {
  const { results } = await db.prepare(
    'INSERT INTO sessions DEFAULT VALUES RETURNING id'
  ).all();
  return results[0].id;
}

export async function saveInteraction(db, { sessionId, question, answer, feedback }) {
  await db.prepare(
    `INSERT INTO interactions (session_id, question, answer, feedback)
     VALUES (?1, ?2, ?3, ?4)`
  ).bind(sessionId, question, answer ?? null, feedback ?? null)
   .run();
}

export async function getSessions(db) {
  const { results } = await db.prepare(
    `SELECT id, created_at FROM sessions ORDER BY created_at DESC`
  ).all();
  return results;
}

export async function getInteractions(db, sessionId) {
  const { results } = await db.prepare(
    `SELECT id, question, answer, feedback, created_at
       FROM interactions
      WHERE session_id = ?1
   ORDER BY created_at`
  ).bind(sessionId).all();
  return results;
}

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { chat } from './llm.js';
import { transcribe } from './whisper.js';
import {
  createSession,
  saveInteraction,
  getSessions,
  getInteractions
} from './db.js';

const app = new Hono().basePath('/api');
app.use('*', cors());

// ---------- Session CRUD ----------
app.post('/sessions', async (c) => {
  const id = await createSession(c.env.DB);
  return c.json({ session_id: id });
});

app.get('/sessions', async (c) => {
  return c.json(await getSessions(c.env.DB));
});

app.get('/sessions/:id', async (c) => {
  const { id } = c.req.param();
  return c.json(await getInteractions(c.env.DB, id));
});

// ---------- Interview flow ----------
app.post('/sessions/:id/questions', async (c) => {
  const { id } = c.req.param();
  const { topic = 'general' } = await c.req.json();

  const question = await chat([
    { role: 'system', content: 'You are an expert interviewer.' },
    { role: 'user', content: `Generate one interview question about ${topic}.` }
  ], c.env);

  // store Q (answer/feedback empty for now)
  await saveInteraction(c.env.DB, { sessionId: id, question });
  return c.json({ question });
});

app.post('/sessions/:id/answer', async (c) => {
  const { id } = c.req.param();
  const { question, answer } = await c.req.json();

  const feedback = await chat([
    { role: 'system', content: 'You are an interviewer giving constructive feedback.' },
    { role: 'user', content: `Q: ${question}\nA: ${answer}\nGive feedback:` }
  ], c.env);

  await saveInteraction(c.env.DB, { sessionId: id, question, answer, feedback });
  return c.json({ feedback });
});

// ---------- Whisper transcript ----------
app.post('/transcripts', async (c) => {
  const { audio } = await c.req.json(); // expect base64 WAV
  const text = await transcribe(audio, c.env);
  return c.json({ text });
});

export default app;

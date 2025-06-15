export async function transcribe(base64Audio, env) {
  const { text } = await env.AI.run(
    '@cf/openai/distil-whisper',
    { audio: base64Audio, format: 'wav' }
  );
  return text;
}

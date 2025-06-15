// messages = [{ role: "system"|"user"|"assistant", content: "..." }]
export async function chat(messages, env) {
  /* -------------------------------------------------- 1 — OpenAI */
  if (env.OPENAI_API_KEY) {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7
      })
    });

    if (!r.ok) {
      throw new Error(`OpenAI HTTP ${r.status}: ${await r.text()}`);
    }

    const j = await r.json();
    if (!j.choices?.[0]?.message?.content) {
      throw new Error(`OpenAI response missing choices: ${JSON.stringify(j)}`);
    }
    return j.choices[0].message.content.trim();
  }

  /* ------------------------------------------- 2 — OpenRouter free */
  if (env.OPENROUTER_API_KEY) {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",  // ✅ valid free model
        messages,
        temperature: 0.7
      })
    });

    if (!r.ok) {
      throw new Error(`OpenRouter HTTP ${r.status}: ${await r.text()}`);
    }

    const j = await r.json();
    if (!j.choices?.[0]?.message?.content) {
      throw new Error(
        `OpenRouter response missing choices: ${JSON.stringify(j)}`
      );
    }
    return j.choices[0].message.content.trim();
  }

  /* ------------------------------ 3 — Workers-AI fallback (Mistral) */
  const resp = await env.AI.run("@cf/mistral/mistral-7b-instruct", { messages });
  return resp.response.trim();
}

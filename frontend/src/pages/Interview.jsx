import { useState, useEffect } from "react";
import api from "../lib/api";

export default function Interview() {
  /* ---------- state ---------- */
  const [sessionId, setSessionId] = useState(null);

  const [topic, setTopic]       = useState("operating systems");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer]     = useState("");
  const [feedback, setFeedback] = useState("");

  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingA, setLoadingA] = useState(false);
  const [error, setError]       = useState("");

  /* ---------- create a session once ---------- */
  useEffect(() => {
    (async () => {
      const { session_id } = await api.post("/sessions");
      setSessionId(session_id);
    })();
  }, []);

  /* ---------- handlers ---------- */
  async function generateQuestion() {
    if (!sessionId) return;
    setLoadingQ(true);
    setError("");
    setAnswer("");
    setFeedback("");

    try {
      const data = await api.post(`/sessions/${sessionId}/questions`, { topic });
      setQuestion(data.question);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingQ(false);
    }
  }

  async function submitAnswer() {
    if (!answer.trim()) return;
    setLoadingA(true);
    setError("");

    try {
      const data = await api.post(
        `/sessions/${sessionId}/answer`,
        { question, answer }
      );
      setFeedback(data.feedback);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoadingA(false);
    }
  }

  /* ---------- ui ---------- */
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Interview Sandbox</h2>

      {/* Topic input + generate */}
      <div className="flex gap-2">
        <input
          className="border p-2 rounded flex-1"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
          onClick={generateQuestion}
          disabled={loadingQ || !sessionId}
        >
          {loadingQ ? "..." : "Generate Question"}
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {/* Question */}
      {question && (
        <div className="space-y-4">
          <p className="font-medium">{question}</p>

          {/* Answer textarea */}
          <textarea
            className="w-full border p-2 rounded h-28"
            placeholder="Type your answer here…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <button
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
            onClick={submitAnswer}
            disabled={loadingA}
          >
            {loadingA ? "Evaluating…" : "Submit Answer"}
          </button>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className="border-l-4 border-green-600 pl-4 py-2 bg-green-50 rounded">
          <h3 className="font-semibold mb-1">Feedback</h3>
          <p className="whitespace-pre-line">{feedback}</p>
        </div>
      )}
    </div>
  );
}

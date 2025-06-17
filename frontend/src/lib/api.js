const BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.json();
}

export default {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body)
};

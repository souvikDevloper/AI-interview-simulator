import { useState } from "react";

export default function Settings() {
  const [base, setBase] = useState(import.meta.env.VITE_API_BASE ?? "");
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Settings</h2>
      <label className="block">
        API base URL
        <input
          className="border ml-2 p-1"
          value={base}
          onChange={(e) => setBase(e.target.value)}
        />
      </label>
      <p className="text-sm text-gray-500">
        Leave blank to use same origin (<code>/api</code>).
      </p>
    </div>
  );
}

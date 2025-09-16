// src/app/App.tsx
import React, { useState } from "react";
import { Scanner } from "../components/Scanner"; // keep as named import in your repo

export default function App() {
  const [last, setLast] = useState<string>("—");
  const [enabled, setEnabled] = useState(true);
  const [torch, setTorch] = useState(false);

  // Accepts many shapes the scanner libs use and extracts a string
  const handleScan = (payload: any) => {
    let text: string | undefined;

    if (!payload) return;

    // 1) plain string
    if (typeof payload === "string") text = payload;

    // 2) single object with common fields
    else if (typeof payload === "object") {
      text =
        payload.text ??
        payload.rawValue ??
        payload.data ??
        payload.codeResult?.code; // sometimes used by ZXing/Quagga-like libs
    }

    // 3) array of results (pick first)
    if (!text && Array.isArray(payload) && payload.length) {
      const first = payload[0];
      text =
        (typeof first === "string" ? first : first?.text ?? first?.rawValue ?? first?.data) || undefined;
    }

    if (text && text !== last) {
      setLast(text);
      // Optional: haptic + beep (works only if user interacted with the page)
      try { navigator.vibrate?.(30); } catch {}
      // You can host a small beep and play it here if desired
    }
  };

  return (
    <div style={{ fontFamily: "Inter, system-ui, Arial", padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Scanflow React</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setEnabled(v => !v)}>{enabled ? "Stop Camera" : "Start Camera"}</button>
          <button onClick={() => setTorch(v => !v)}>{torch ? "Torch Off" : "Torch On"}</button>
        </div>
      </header>

      <p style={{ margin: "8px 0 16px" }}>
        A minimal demo showing live QR scanning with a finder overlay and simple de-dup logic.
      </p>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
        <Scanner
          enabled={enabled}
          torch={torch}
          style={{ width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden" }}
          className="scanner"
          // Wire ALL common callbacks to the same handler.
          // @ts-ignore - tolerate props that may not exist in your type defs
          onDecode={handleScan}
          // @ts-ignore
          onResult={handleScan}
          // @ts-ignore
          onDetected={handleScan}
          // @ts-ignore
          onScan={handleScan}
        />
      </div>

      <section style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 6 }}>Last result</h3>
        <code style={{ display: "inline-block", padding: "8px 10px", background: "#f3f4f6", borderRadius: 8 }}>
          {last}
        </code>
      </section>

      <footer style={{ marginTop: 24, fontSize: 14, color: "#6b7280" }}>
        Built by <strong>Arushi Mathur</strong>. Torch support depends on device/browser.
      </footer>
    </div>
  );
}

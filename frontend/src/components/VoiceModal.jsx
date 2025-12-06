import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "https://voice-task-tracker-backend.onrender.com";

export default function VoiceModal({ open, onClose, onCreate }) {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [parsed, setParsed] = useState(null);

  useEffect(() => {
    setTranscript("");
    setParsed(null);
  }, [open]);

  let recognition;
  if (typeof window !== "undefined") {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.interimResults = false;
      recognition.lang = "en-US";
      recognition.onresult = (e) => {
        const text = Array.from(e.results).map(r => r[0].transcript).join("");
        setTranscript(text);
      };
      recognition.onend = () => setListening(false);
    }
  }

  const start = () => {
    if (!recognition) { alert("SpeechRecognition not supported. Use Chrome/Edge"); return; }
    setTranscript("");
    setListening(true);
    recognition.start();
  };

  const stop = () => { if (recognition) recognition.stop(); };

  const parse = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/voice/parse`, { transcript });
      setParsed(res.data.parsed || res.data);
    } catch (err) {
      console.error("Parse error", err);
      alert("Parsing failed");
    }
  };

  const create = async () => {
    // ensure dueDate is ISO if user entered datetime-local format
    const payload = {
      title: parsed.title,
      description: parsed.description || "",
      status: parsed.status || "To Do",
      priority: parsed.priority || null,
      dueDate: parsed.dueDate || null
    };
    await onCreate(payload);
  };

  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="flex-between">
          <h3>Create task by voice</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button className="btn btn-primary" onClick={listening ? stop : start}>{listening ? "Stop" : "Record"}</button>
              <button className="btn btn-ghost" onClick={parse} disabled={!transcript}>Parse</button>
              <div className="small center" style={{ alignSelf: "center" }}>{listening ? "Listening..." : "Click Record & speak"}</div>
            </div>

            <div className="transcript-box">
              {transcript || <span className="small">No transcript yet</span>}
            </div>
          </div>

          <div style={{ width: 320 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Parsed preview</div>

            {!parsed && <div className="small">Click Parse to extract fields from the transcript. You can edit before saving.</div>}

            {parsed && (
              <div style={{ display: "flex", flexDirection: "column", gap:8 }}>
                <label className="small">Title</label>
                <input className="input" value={parsed.title || ""} onChange={(e)=>setParsed({...parsed,title:e.target.value})} />

                <label className="small">Priority</label>
                <select className="input" value={parsed.priority || ""} onChange={(e)=>setParsed({...parsed,priority:e.target.value})}>
                  <option value="">None</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>

                <label className="small">Due date</label>
                <input className="input" type="datetime-local" value={parsed.dueDate ? parsed.dueDate.slice(0,16) : ""} onChange={(e)=>setParsed({...parsed,dueDate:e.target.value})} />

                <div style={{ display: "flex", gap:8, marginTop:8 }}>
                  <button className="btn btn-primary" onClick={create}>Create Task</button>
                  <button className="btn btn-ghost" onClick={()=>{ setParsed(null); setTranscript(""); }}>Reset</button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

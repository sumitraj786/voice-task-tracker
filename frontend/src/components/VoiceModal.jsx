import React, { useState, useEffect } from "react";
import axios from "axios";

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
        const res = await axios.post("https://voice-task-tracker-backend.onrender.com/api/voice/parse", { transcript });
        setParsed(res.data.parsed || res.data);
    };

    const save = async () => {
        // prepare payload and give defaults
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
        <div style={{ position: 'fixed', left: 20, top: 20, background: '#fff', padding: 20, border: '1px solid #ccc' }}>
            <h3>Voice Input</h3>
            <div>
                <button onClick={listening ? stop : start}>{listening ? "Stop" : "Record"}</button>
                <button disabled={!transcript} onClick={parse}>Parse</button>
                <button onClick={onClose}>Close</button>
            </div>
            <div style={{ marginTop: 10 }}>
                <strong>Transcript:</strong>
                <div>{transcript || <i>(no transcript yet)</i>}</div>
            </div>

            {parsed && (
                <div style={{ marginTop: "10px" }}>
                    <h3>Parsed Task Details</h3>

                    <label>Title</label>
                    <input
                        type="text"
                        value={parsed.title || ""}
                        onChange={(e) => setParsed({ ...parsed, title: e.target.value })}
                        style={{ width: "100%", marginBottom: "10px" }}
                    />

                    <label>Priority</label>
                    <select
                        value={parsed.priority || ""}
                        onChange={(e) => setParsed({ ...parsed, priority: e.target.value })}
                        style={{ width: "100%", marginBottom: "10px" }}
                    >
                        <option value="">None</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    <label>Due Date</label>
                    <input
                        type="datetime-local"
                        value={parsed.dueDate ? parsed.dueDate.slice(0, 16) : ""}
                        onChange={(e) => setParsed({ ...parsed, dueDate: e.target.value })}
                        style={{ width: "100%", marginBottom: "10px" }}
                    />

                    <button
                        onClick={() => onCreate(parsed)}
                        style={{
                            padding: "8px 12px",
                            background: "green",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            marginTop: "10px"
                        }}
                    >
                        Create Task
                    </button>
                </div>
            )}

        </div>
    );
}

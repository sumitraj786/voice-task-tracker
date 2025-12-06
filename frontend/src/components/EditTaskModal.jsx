import React, { useState, useEffect } from "react";

export default function EditTaskModal({ open, onClose, task, onSave }) {
  if (!open || !task) return null;

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Load existing task into fields
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setPriority(task.priority || "");
      setDueDate(task.dueDate ? task.dueDate.slice(0, 16) : "");
    }
  }, [task]);

  function handleSave() {
    onSave({
      id: task.id,                 // backend requires task ID
      title,
      priority,
      dueDate,
      description: task.description || "",
      status: task.status || "To Do",
    });
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="flex-between">
          <h3>Edit Task</h3>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          
          <label className="small">Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />

          <label className="small">Priority</label>
          <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">None</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label className="small">Due Date</label>
          <input
            className="input"
            type="datetime-local"
            value={dueDate || ""}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>

            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

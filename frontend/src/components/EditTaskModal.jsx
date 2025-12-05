import React, { useState } from "react";

export default function EditTaskModal({ open, onClose, task, onSave }) {
  if (!open) return null;

  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");

  const save = () => {
    onSave({
      ...task,
      title,
      priority,
      dueDate
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{ background: "white", padding: 20, width: 350 }}>
        <h3>Edit Task</h3>

        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} />

        <label>Priority</label>
        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="">None</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label>Due Date</label>
        <input
          type="datetime-local"
          value={dueDate ? dueDate.slice(0,16) : ""}
          onChange={e => setDueDate(e.target.value)}
        />

        <br/><br/>
        <button onClick={save}>Save</button>
        <button onClick={onClose} style={{ marginLeft: 10 }}>Cancel</button>
      </div>
    </div>
  );
}

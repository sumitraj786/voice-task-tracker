import React from "react";

function priorityBadge(p) {
  if (!p) return <span className="badge badge-none">No priority</span>;
  if (p.toLowerCase() === "high") return <span className="badge badge-high">High</span>;
  if (p.toLowerCase() === "medium") return <span className="badge badge-medium">Medium</span>;
  if (p.toLowerCase() === "low") return <span className="badge badge-low">Low</span>;
  return <span className="badge badge-none">{p}</span>;
}

export default function TaskList({ tasks, onEdit, onDelete }) {
  if (!tasks) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {tasks.length === 0 && <div className="small center">No tasks available.</div>}

      {tasks.map((task) => (
        <div key={task.id} className="task-card">
          <div className="task-top">
            <div>
              <div className="task-title">{task.title}</div>
              <div className="task-meta">
                <div>{priorityBadge(task.priority)}</div>
                <div>{task.status}</div>
                <div>{task.dueDate ? new Date(task.dueDate).toLocaleString() : <span className="small">No due</span>}</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button className="btn btn-ghost" onClick={() => onEdit(task)} style={{ padding: "6px 8px" }}>Edit</button>
              <button className="btn btn-outline" onClick={() => onDelete(task)} style={{ padding: "6px 8px", background: "transparent", color: "var(--danger)", borderColor: "rgba(220,38,38,0.08)" }}>Delete</button>
            </div>
          </div>

          {task.description && <div style={{ fontSize: 13, color: "var(--muted)" }}>{task.description}</div>}
        </div>
      ))}
    </div>
  );
}

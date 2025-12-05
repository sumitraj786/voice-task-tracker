import React from "react";

export default function TaskList({ tasks, onEdit, onDelete }) {
  return (
    <div style={{ marginTop: "20px" }}>
      {tasks.length === 0 && <p>No tasks available.</p>}

      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            padding: "12px",
            marginBottom: "10px",
            background: "white",
            borderRadius: "6px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
          }}
        >
          <strong>{task.title}</strong>

          <div style={{ fontSize: "13px", color: "#555" }}>
            Priority: {task.priority || "None"}
          </div>

          <div style={{ fontSize: "13px", color: "#555" }}>
            Status: {task.status}
          </div>

          <div style={{ fontSize: "13px", color: "#555" }}>
            Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : "None"}
          </div>

          <div style={{ marginTop: "8px" }}>
            <button
              onClick={() => onEdit(task)}
              style={{
                marginRight: "10px",
                padding: "5px 10px",
                background: "#007bff",
                color: "white",
                borderRadius: "4px",
                border: "none",
              }}
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(task)}
              style={{
                padding: "5px 10px",
                background: "red",
                color: "white",
                borderRadius: "4px",
                border: "none",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function KanbanBoard({ tasks, onStatusChange }) {
  // grouped tasks by status
  const columns = {
    "To Do": tasks.filter(t => t.status === "To Do"),
    "In Progress": tasks.filter(t => t.status === "In Progress"),
    "Done": tasks.filter(t => t.status === "Done")
  };

  function handleDragEnd(result) {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;
    onStatusChange(draggableId, newStatus);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        {Object.keys(columns).map(status => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  flex: 1,
                  minHeight: "400px",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  background: "#f8f9fa"
                }}
              >
                <h3>{status}</h3>
                {columns[status].map((task, index) => (
                  <Draggable
                    draggableId={String(task.id)}
                    index={index}
                    key={task.id}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        style={{
                          padding: "10px",
                          background: "white",
                          marginBottom: "10px",
                          borderRadius: "6px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                          ...provided.draggableProps.style
                        }}
                      >
                        <strong>{task.title}</strong>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          Priority: {task.priority || "None"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : "None"}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

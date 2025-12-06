import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function priorityColor(p){
  if (!p) return "badge-none";
  if (p.toLowerCase() === "high") return "badge-high";
  if (p.toLowerCase() === "medium") return "badge-medium";
  if (p.toLowerCase() === "low") return "badge-low";
  return "badge-none";
}

export default function KanbanBoard({ tasks, onStatusChange }) {
  const columns = {
    "To Do": tasks.filter(t => t.status === "To Do"),
    "In Progress": tasks.filter(t => t.status === "In Progress"),
    "Done": tasks.filter(t => t.status === "Done")
  };

  function handleDragEnd(result) {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    onStatusChange(taskId, newStatus);
  }

  return (
    <div className="kanban-columns">
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.keys(columns).map(status => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div className="kanban-column" ref={provided.innerRef} {...provided.droppableProps}>
                <div className="column-header">
                  <div className="column-title">{status}</div>
                  <div className="column-count">{columns[status].length}</div>
                </div>

                {columns[status].map((task, i) => (
                  <Draggable draggableId={String(task.id)} index={i} key={task.id}>
                    {(prov) => (
                      <div className="task-card" ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontWeight:700 }}>{task.title}</div>
                          <div className={priorityColor(task.priority)} style={{ fontSize:12, padding: "4px 8px" }}>
                            {task.priority || "None"}
                          </div>
                        </div>

                        <div style={{ marginTop:8, fontSize:13, color:"var(--muted)" }}>
                          {task.dueDate ? new Date(task.dueDate).toLocaleString() : "No due date"}
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
      </DragDropContext>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import axios from "axios";

import "./styles.css";

import VoiceModal from "./components/VoiceModal";
import TaskList from "./components/TaskList";
import KanbanBoard from "./components/KanbanBoard";
import EditTaskModal from "./components/EditTaskModal";
import DeleteConfirm from "./components/DeleteConfirm";

const API_BASE = "https://voice-task-tracker-backend.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);

  const [showVoice, setShowVoice] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  async function loadTasks() {
    try {
      const res = await axios.get(`${API_BASE}/api/tasks`);
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreateTask(task) {
    await axios.post(`${API_BASE}/api/tasks`, task);
    await loadTasks();
    setShowVoice(false);
  }

  async function handleStatusChange(taskId, newStatus) {
    await axios.put(`${API_BASE}/api/tasks/${taskId}`, { status: newStatus });
    await loadTasks();
  }
  
  async function handleEditSave(updatedTask) {
    const cleaned = {
      title: updatedTask.title,
      description: updatedTask.description || "",
      priority: updatedTask.priority || null,
      dueDate: updatedTask.dueDate || null,
      status: updatedTask.status || selectedTask.status
    };

    await axios.put(`${API_BASE}/api/tasks/${selectedTask.id}`, cleaned);

    await loadTasks();
    setShowEdit(false);
  }

  async function handleDelete() {
    await axios.delete(`${API_BASE}/api/tasks/${selectedTask.id}`);
    await loadTasks();
    setShowDelete(false);
  }

  function openEdit(task) {
    setSelectedTask(task);
    setShowEdit(true);
  }

  function openDelete(task) {
    setSelectedTask(task);
    setShowDelete(true);
  }

  return (
    <div className="app-shell">
      <div className="header">
        <div className="brand">
          <div className="logo">VT</div>
          <div>
            <div className="title">Voice Task Tracker</div>
            <div className="small">Voice-driven tasks · React + Node + Prisma</div>
          </div>
        </div>

        <div className="controls">
          <button className="btn btn-ghost" onClick={loadTasks}>Refresh</button>
          <button className="btn btn-primary" onClick={() => setShowVoice(true)}>
            New Task (Voice)
          </button>
        </div>
      </div>

      <div className="layout">
        <div className="kanban">
          <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
        </div>

        <aside className="sidebar">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontWeight: 700 }}>Tasks</div>
            <div className="small">{tasks.length} total</div>
          </div>

          <TaskList tasks={tasks} onEdit={openEdit} onDelete={openDelete} />
        </aside>
      </div>

      <VoiceModal
        open={showVoice}
        onClose={() => setShowVoice(false)}
        onCreate={handleCreateTask}
      />

      <EditTaskModal
        open={showEdit}
        task={selectedTask}
        onClose={() => setShowEdit(false)}
        onSave={handleEditSave}
      />

      <DeleteConfirm
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default App;

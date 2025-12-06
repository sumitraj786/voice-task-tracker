import React, { useState, useEffect } from "react";
import axios from "axios";

import "./styles.css";

import VoiceModal from "./components/VoiceModal";
import TaskList from "./components/TaskList";
import KanbanBoard from "./components/KanbanBoard";
import EditTaskModal from "./components/EditTaskModal";
import DeleteConfirm from "./components/DeleteConfirm";

// using one base URL for the backend (Render)
const API_BASE = "https://voice-task-tracker-backend.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);

  // modal states
  const [showVoice, setShowVoice] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // selected task for edit/delete
  const [selectedTask, setSelectedTask] = useState(null);

  // Load all tasks from backend
  async function loadTasks() {
    try {
      const res = await axios.get(`${API_BASE}/api/tasks`);
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to load tasks", err);
    }
  }

  // load tasks on page load
  useEffect(() => {
    loadTasks();
  }, []);

  // create new task (from voice modal)
  async function handleCreateTask(task) {
    await axios.post(`${API_BASE}/api/tasks`, task);
    await loadTasks();
    setShowVoice(false);
  }

  // update status (Kanban drag & drop)
  async function handleStatusChange(taskId, newStatus) {
    await axios.put(`${API_BASE}/api/tasks/${taskId}`, { status: newStatus });
    await loadTasks();
  }

  // Save edits from the edit modal
  async function handleEditSave(updatedTask) {
    await axios.put(`${API_BASE}/api/tasks/${updatedTask.id}`, updatedTask);
    await loadTasks();
    setShowEdit(false);
  }

  // Delete task
  async function handleDelete() {
    await axios.delete(`${API_BASE}/api/tasks/${selectedTask.id}`);
    await loadTasks();
    setShowDelete(false);
  }

  // open the edit modal
  function openEdit(task) {
    setSelectedTask(task);
    setShowEdit(true);
  }

  // open delete modal
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
          <button className="btn btn-primary" onClick={() => setShowVoice(true)}>New Task (Voice)</button>
        </div>
      </div>

      <div className="layout">
        <div>
          <div className="kanban">
            <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />
          </div>
        </div>

        <aside className="sidebar">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontWeight: 700 }}>Tasks</div>
            <div className="small">{tasks.length} total</div>
          </div>

          <TaskList tasks={tasks} onEdit={openEdit} onDelete={openDelete} />
        </aside>
      </div>

      <VoiceModal open={showVoice} onClose={() => setShowVoice(false)} onCreate={handleCreateTask} />

      <EditTaskModal open={showEdit} task={selectedTask} onClose={() => setShowEdit(false)} onSave={handleEditSave} />

      <DeleteConfirm open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} />
    </div>
  );
}

export default App;

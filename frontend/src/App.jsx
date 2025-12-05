import React, { useState, useEffect } from "react";
import axios from "axios";

import VoiceModal from "./components/VoiceModal";
import TaskList from "./components/TaskList";
import KanbanBoard from "./components/KanbanBoard";
import EditTaskModal from "./components/EditTaskModal";
import DeleteConfirm from "./components/DeleteConfirm";

function App() {
  const [tasks, setTasks] = useState([]);

  // modals
  const [showVoice, setShowVoice] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // selected task for edit/delete
  const [selectedTask, setSelectedTask] = useState(null);

  // Load tasks from backend
  async function loadTasks() {
    const res = await axios.get("http://localhost:4000/api/tasks");
    setTasks(res.data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // Create task from voice modal
  async function handleCreateTask(task) {
    await axios.post("http://localhost:4000/api/tasks", task);
    await loadTasks();
    setShowVoice(false);
  }

  // Kanban drag-drop updates only status
  async function handleStatusChange(taskId, newStatus) {
    await axios.put(`http://localhost:4000/api/tasks/${taskId}`, {
      status: newStatus,
    });
    await loadTasks();
  }

  // Save edited task
  async function handleEditSave(updatedTask) {
    await axios.put(`http://localhost:4000/api/tasks/${updatedTask.id}`, updatedTask);
    await loadTasks();
    setShowEdit(false);
  }

  // Delete selected task
  async function handleDelete() {
    await axios.delete(`http://localhost:4000/api/tasks/${selectedTask.id}`);
    await loadTasks();
    setShowDelete(false);
  }

  // When clicking "edit" on TaskList
  function openEdit(task) {
    setSelectedTask(task);
    setShowEdit(true);
  }

  // When clicking "delete" on TaskList
  function openDelete(task) {
    setSelectedTask(task);
    setShowDelete(true);
  }

  return (
    <div className="p-4">
      <h1 style={{ fontFamily: "Arial" }}>Voice Task Tracker</h1>

      <button onClick={() => setShowVoice(true)}>Open Voice Input</button>

      {/* Voice Modal */}
      <VoiceModal
        open={showVoice}
        onClose={() => setShowVoice(false)}
        onCreate={handleCreateTask}
      />

      {/* Kanban Board */}
      <h2>Kanban Board</h2>
      <KanbanBoard tasks={tasks} onStatusChange={handleStatusChange} />

      {/* Task List with edit & delete */}
      <h2>Task List</h2>
      <TaskList
        tasks={tasks}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {/* Edit Modal */}
      <EditTaskModal
        open={showEdit}
        task={selectedTask}
        onClose={() => setShowEdit(false)}
        onSave={handleEditSave}
      />

      {/* Delete Confirmation */}
      <DeleteConfirm
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default App;

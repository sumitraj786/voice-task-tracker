export default function DeleteConfirm({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div style={{ background: "white", padding: 20 }}>
        <h3>Delete Task?</h3>
        <p>This action cannot be undone.</p>
        <button onClick={onConfirm} style={{ background: "red", color: "white" }}>
          Delete
        </button>
        <button onClick={onClose} style={{ marginLeft: 10 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

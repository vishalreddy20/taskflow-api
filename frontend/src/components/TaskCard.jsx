const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  'in-progress': { label: 'In Progress', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
  done: { label: 'Done', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' },
};

const PRIORITY_CONFIG = {
  low: { label: 'Low', color: '#6b7280', icon: '↓' },
  medium: { label: 'Medium', color: '#f59e0b', icon: '→' },
  high: { label: 'High', color: '#ef4444', icon: '↑' },
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      onDelete(task._id);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <div className="task-badges">
          <span
            className="badge badge-status"
            style={{ color: status.color, background: status.bg }}
          >
            {status.label}
          </span>
          <span
            className="badge badge-priority"
            style={{ color: priority.color }}
          >
            {priority.icon} {priority.label}
          </span>
        </div>
        <div className="task-actions">
          <button
            className="btn-icon btn-edit"
            onClick={() => onEdit(task)}
            id={`edit-task-${task._id}`}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            className="btn-icon btn-delete"
            onClick={handleDelete}
            id={`delete-task-${task._id}`}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
      <h3 className="task-title">{task.title}</h3>
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-footer">
        {task.owner && typeof task.owner === 'object' && (
          <span className="task-owner">👤 {task.owner.name}</span>
        )}
        <span className="task-date">{formatDate(task.createdAt)}</span>
      </div>
    </div>
  );
};

export default TaskCard;

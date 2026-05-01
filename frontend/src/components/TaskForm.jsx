import { useState, useEffect } from 'react';

const INITIAL_STATE = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
};

const TaskForm = ({ onSubmit, initialData = null, onCancel, isLoading }) => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required.');
      return;
    }
    await onSubmit(formData);
  };

  const isEditing = !!initialData;

  return (
    <form className="task-form" onSubmit={handleSubmit} id={isEditing ? 'edit-task-form' : 'create-task-form'}>
      <h3 className="form-title">{isEditing ? '✏️ Edit Task' : '➕ New Task'}</h3>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="task-title" className="form-label">Title *</label>
        <input
          id="task-title"
          type="text"
          name="title"
          className="form-input"
          placeholder="Enter task title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-description" className="form-label">Description</label>
        <textarea
          id="task-description"
          name="description"
          className="form-input form-textarea"
          placeholder="Describe the task (optional)"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="task-status" className="form-label">Status</label>
          <select
            id="task-status"
            name="status"
            className="form-input form-select"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="task-priority" className="form-label">Priority</label>
          <select
            id="task-priority"
            name="priority"
            className="form-input form-select"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className={`btn btn-primary ${isLoading ? 'btn-loading' : ''}`}
          disabled={isLoading}
          id={isEditing ? 'update-task-btn' : 'create-task-btn'}
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
        </button>
        {isEditing && (
          <button type="button" className="btn btn-ghost" onClick={onCancel} id="cancel-edit-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;

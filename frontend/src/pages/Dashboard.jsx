import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import api from '../api/axios';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 4000);
  };

  const fetchTasks = useCallback(async () => {
    setIsLoadingTasks(true);
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load tasks.';
      showAlert('error', message);
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/tasks', formData);
      setTasks((prev) => [response.data.data, ...prev]);
      showAlert('success', 'Task created successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task.';
      showAlert('error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (formData) => {
    if (!editingTask) return;
    setIsSubmitting(true);
    try {
      const response = await api.put(`/tasks/${editingTask._id}`, formData);
      setTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? response.data.data : t))
      );
      setEditingTask(null);
      showAlert('success', 'Task updated successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task.';
      showAlert('error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      showAlert('success', 'Task deleted successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete task.';
      showAlert('error', message);
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-container">

          {alert.message && (
            <div className={`alert alert-${alert.type} alert-floating`} id="dashboard-alert">
              {alert.type === 'success' ? '✅' : '❌'} {alert.message}
            </div>
          )}

          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">My Tasks</h1>
              <p className="dashboard-subtitle">Manage and track your work items</p>
            </div>
            <div className="stats-row">
              <div className="stat-pill stat-total">
                <span className="stat-num">{taskStats.total}</span>
                <span className="stat-label">Total</span>
              </div>
              <div className="stat-pill stat-pending">
                <span className="stat-num">{taskStats.pending}</span>
                <span className="stat-label">Pending</span>
              </div>
              <div className="stat-pill stat-progress">
                <span className="stat-num">{taskStats.inProgress}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat-pill stat-done">
                <span className="stat-num">{taskStats.done}</span>
                <span className="stat-label">Done</span>
              </div>
            </div>
          </div>

          <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
              <TaskForm
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                initialData={editingTask}
                onCancel={handleCancelEdit}
                isLoading={isSubmitting}
              />
            </aside>

            <section className="dashboard-tasks">
              {isLoadingTasks ? (
                <div className="tasks-loading">
                  <div className="spinner"></div>
                  <p>Loading your tasks...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="tasks-empty" id="tasks-empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No tasks yet</h3>
                  <p>Create your first task using the form on the left.</p>
                </div>
              ) : (
                <div className="tasks-grid" id="tasks-grid">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEditClick}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

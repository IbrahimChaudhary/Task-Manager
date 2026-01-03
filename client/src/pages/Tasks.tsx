import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { taskService } from '../services/task.service';
import { projectService } from '../services/project.service';
import { userService } from '../services/user.service';
import type { CreateTaskData, Project, Task, User } from '../types';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    projectId: '',
    assignedTo: [],
    status: 'ToDo',
    priority: 'Medium',
    dueDate: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, [filterStatus]);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getAll(undefined, filterStatus || undefined);
      setTasks(response.tasks);
    } catch (error: any) {
      toast.error('Failed to fetch tasks');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAll();
      setProjects(response.projects);
    } catch (error: any) {
      toast.error('Failed to fetch projects');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.users);
    } catch (error: any) {
      toast.error('Failed to fetch users');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingTask) {
        await taskService.update(editingTask._id, formData);
        toast.success('Task updated successfully');
      } else {
        await taskService.create(formData);
        toast.success('Task created successfully');
      }

      fetchTasks();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleStatusChange = async (taskId: string, status: 'ToDo' | 'InProgress' | 'Completed') => {
    try {
      await taskService.updateStatus(taskId, status);
      toast.success('Status updated successfully');
      fetchTasks();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      projectId: typeof task.projectId === 'object' ? task.projectId._id : task.projectId,
      assignedTo: task.assignedTo.map((u: any) => u._id),
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.delete(id);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      projectId: '',
      assignedTo: [],
      status: 'ToDo',
      priority: 'Medium',
      dueDate: '',
    });
  };

  const canManage = user?.role === 'Admin' || user?.role === 'ProjectManager';

  const groupedTasks = {
    ToDo: tasks.filter((t) => t.status === 'ToDo'),
    InProgress: tasks.filter((t) => t.status === 'InProgress'),
    Completed: tasks.filter((t) => t.status === 'Completed'),
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Status</option>
              <option value="ToDo">To Do</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {canManage && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
              >
                <Plus size={20} />
                <span>New Task</span>
              </button>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(groupedTasks).map(([status, statusTasks]) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4">
              <h2 className="font-bold text-lg mb-4 text-gray-800">
                {status === 'ToDo' ? 'To Do' : status === 'InProgress' ? 'In Progress' : 'Completed'} ({statusTasks.length})
              </h2>

              <div className="space-y-3">
                {statusTasks.map((task) => (
                  <div key={task._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-800">{task.title}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'High'
                            ? 'bg-red-100 text-red-800'
                            : task.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                    <div className="space-y-2 text-xs text-gray-500 mb-3">
                      <div>Project: {typeof task.projectId === 'object' ? task.projectId.name : 'N/A'}</div>
                      {task.assignedTo.length > 0 && (
                        <div>Assigned: {task.assignedTo.map((u) => u.name).join(', ')}</div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Status Change Buttons */}
                    <div className="flex space-x-2 mb-2">
                      {task.status !== 'ToDo' && (
                        <button
                          onClick={() => handleStatusChange(task._id, 'ToDo')}
                          className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                        >
                          To Do
                        </button>
                      )}
                      {task.status !== 'InProgress' && (
                        <button
                          onClick={() => handleStatusChange(task._id, 'InProgress')}
                          className="text-xs bg-yellow-100 px-2 py-1 rounded hover:bg-yellow-200"
                        >
                          In Progress
                        </button>
                      )}
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => handleStatusChange(task._id, 'Completed')}
                          className="text-xs bg-green-100 px-2 py-1 rounded hover:bg-green-200"
                        >
                          Complete
                        </button>
                      )}
                    </div>

                    {/* Edit/Delete Buttons */}
                    {canManage && (
                      <div className="flex space-x-2 border-t pt-2">
                        <button
                          onClick={() => handleEdit(task)}
                          className="flex-1 bg-gray-100 text-gray-700 px-2 py-1 rounded flex items-center justify-center space-x-1 text-sm hover:bg-gray-200"
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="flex-1 bg-red-100 text-red-700 px-2 py-1 rounded flex items-center justify-center space-x-1 text-sm hover:bg-red-200"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {statusTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">No tasks</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-md my-8">
              <h2 className="text-2xl font-bold mb-4">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Project</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="ToDo">To Do</option>
                      <option value="InProgress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign To</label>
                  <select
                    multiple
                    value={formData.assignedTo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assignedTo: Array.from(e.target.selectedOptions, (option) => option.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
                  >
                    {users.map((user: any) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  >
                    {editingTask ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Tasks;

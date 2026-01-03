import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardStats } from '../types';
import { FolderKanban, CheckSquare, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.stats);
    } catch (error: any) {
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Projects</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalProjects || 0}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FolderKanban className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Projects</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.activeProjects || 0}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FolderKanban className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalTasks || 0}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <CheckSquare className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Completed Tasks</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats?.tasksByStatus.completed || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Task Status Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tasks by Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="text-gray-500" size={20} />
                <span className="font-medium text-gray-700">To Do</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stats?.tasksByStatus.todo || 0}</p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="text-yellow-500" size={20} />
                <span className="font-medium text-gray-700">In Progress</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {stats?.tasksByStatus.inProgress || 0}
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="text-green-500" size={20} />
                <span className="font-medium text-gray-700">Completed</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {stats?.tasksByStatus.completed || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Tasks</h2>
          {stats?.recentTasks && stats.recentTasks.length > 0 ? (
            <div className="space-y-3">
              {stats.recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{task.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          Project: {typeof task.projectId === 'object' ? task.projectId.name : 'N/A'}
                        </span>
                        <span className="text-xs text-gray-500">Priority: {task.priority}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'InProgress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent tasks</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

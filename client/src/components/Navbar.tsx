import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, FolderKanban, CheckSquare, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold">
              Task Manager
            </Link>

            <div className="hidden md:flex space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded"
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/projects"
                className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded"
              >
                <FolderKanban size={20} />
                <span>Projects</span>
              </Link>

              <Link
                to="/tasks"
                className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded"
              >
                <CheckSquare size={20} />
                <span>Tasks</span>
              </Link>

              {(user?.role === 'Admin' || user?.role === 'ProjectManager') && (
                <Link
                  to="/users"
                  className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded"
                >
                  <Users size={20} />
                  <span>Users</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="font-medium">{user?.name}</span>
              <span className="text-xs text-blue-200">{user?.role}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 hover:bg-blue-700 px-3 py-2 rounded"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

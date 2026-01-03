import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { userService } from '../services/user.service';
import type { User } from '../types';
import { Users as UsersIcon, Mail, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(response.users);
    } catch (error: any) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading users...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <div className="flex items-center space-x-2 text-gray-600">
            <UsersIcon size={20} />
            <span>{users.length} total users</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <UsersIcon className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'Admin'
                        ? 'bg-red-100 text-red-800'
                        : user.role === 'ProjectManager'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {user.role === 'ProjectManager' ? 'Project Manager' : user.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield size={16} />
                  <span>Access Level: {user.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">No users found.</div>
        )}
      </div>
    </Layout>
  );
};

export default Users;

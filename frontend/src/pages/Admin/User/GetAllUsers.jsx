import React, { useState, useEffect } from 'react';
import { Trash2, Mail, CheckCircle, XCircle, Shield, User, Briefcase, Loader } from 'lucide-react';
import { useAuthStore } from "../../../stores/authStore.jsx";
import { useSidebar } from "../../../components/useSidebar";
const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const { getAllUsers, deleteUser, isLoading } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response && response.users) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        // Remove user from local state after successful deletion
        setUsers(users.filter(user => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'client':
        return 'bg-blue-100 text-blue-800';
      case 'freelancer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Shield size={14} />;
      case 'client':
        return <Briefcase size={14} />;
      case 'freelancer':
        return <User size={14} />;
      default:
        return <User size={14} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-gray-800 mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }
  const { isOpen: isSidebarOpen } = useSidebar();

  return (
    <div className={`min-h-screen bg-white transition-all duration-300 ${
        isSidebarOpen ? "ml-100" : "ml-20"
      }`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
          <p className="text-gray-600">Manage and monitor all registered users</p>
        </div>

        {users.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <User size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Users Found</h3>
            <p className="text-gray-600">There are currently no users in the system.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Verified</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Completed Jobs</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Success Rate</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Joined Date</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <Mail size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {getRoleIcon(user.role)}
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {user.isVerified ? (
                            <CheckCircle size={20} className="text-green-500 mx-auto" />
                          ) : (
                            <XCircle size={20} className="text-red-500 mx-auto" />
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-900">{user.stats.completedJobs}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-900">{user.stats.successRate}%</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{formatDate(user.createdAt)}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Total Users: <strong className="text-gray-900">{users.length}</strong></span>
                <span>Verified Users: <strong className="text-gray-900">{users.filter(u => u.isVerified).length}</strong></span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GetAllUsers;
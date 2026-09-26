import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import { SkeletonGrid, SkeletonCard } from '../components/ui/Skeleton';
import { ShieldCheck, Users, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.getAdminStats();
        setData(res);
      } catch (err) {
        toast.error('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      toast.success('User authorization role updated successfully!');
      const updated = await api.getAdminStats();
      setData(updated);
    } catch (err) {
      toast.error(err.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user account?')) return;
    try {
      await api.deleteUser(userId);
      toast.success('User deleted successfully.');
      const updated = await api.getAdminStats();
      setData(updated);
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
        <Sidebar />
        <main className="flex-1 p-8 space-y-6">
          <SkeletonCard height="h-32" />
          <SkeletonGrid count={4} />
        </main>
      </div>
    );
  }

  const stats = data?.stats || {};
  const users = data?.users || [];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-600 font-semibold">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>Platform Administration & User Role Control</span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">
            System Overview & Permission Management
          </h1>

          <p className="text-xs text-slate-500">
            Monitor platform activity, update user authorization roles, and audit prerequisite DAG integrity.
          </p>
        </div>

        {/* System Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
            <span className="text-xs text-slate-500 uppercase font-semibold font-mono">Total Users</span>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalUsers || 0}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
            <span className="text-xs text-indigo-600 uppercase font-semibold font-mono">Students</span>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalStudents || 0}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
            <span className="text-xs text-purple-600 uppercase font-semibold font-mono">Teachers</span>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalTeachers || 0}</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
            <span className="text-xs text-cyan-600 uppercase font-semibold font-mono">Courses</span>
            <div className="text-2xl font-extrabold text-slate-900">{stats.totalCourses || 0}</div>
          </div>
        </div>

        {/* User Management Table */}
        <div id="users" className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              User Role Management & Permissions
            </h2>
            <p className="text-xs text-slate-500">
              Promote or demote users between Student, Teacher, and Admin roles in real-time.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 uppercase font-mono border-b border-slate-200">
                <tr>
                  <th className="p-3.5">User Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Current Role</th>
                  <th className="p-3.5">Role Change</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3.5 text-slate-500 font-mono">{u.email}</td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] uppercase font-bold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-300' : u.role === 'teacher' ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-indigo-500"
                      >
                        <option value="student">student</option>
                        <option value="teacher">teacher</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

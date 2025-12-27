import React, { useState } from 'react';
import { useUsers, useDeleteUser } from '../api/queries';

export const Users: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useUsers(page, 10);
  const deleteUser = useDeleteUser();

  if (isLoading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="alert alert-error">Error loading users</div>;

  const users = data?.users?.users || [];
  // const total = data?.users?.total || 0;

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser.mutateAsync(userId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">Users</h1>
        <button className="btn btn-primary">Add User</button>
      </div>

      <div className="card bg-white dark:bg-neutral-800 shadow overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`badge ${
                      user.role === 'admin'
                        ? 'badge-primary'
                        : user.role === 'seller'
                        ? 'badge-secondary'
                        : 'badge-neutral'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <button className="btn btn-sm btn-ghost">Edit</button>
                  <button className="btn btn-sm btn-error" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <div className="btn-group">
          <button
            className="btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            «
          </button>
          <button className="btn">Page {page}</button>
          <button
            className="btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={users.length < 10}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
};

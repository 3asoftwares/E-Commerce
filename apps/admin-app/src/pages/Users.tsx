import React, { useState } from 'react';
import { useUsers, useDeleteUser, useUpdateUserRole } from '../api/queries';
import { Button, Table, Badge, Spinner, Pagination, Input, Select } from '@e-commerce/ui-library';
import type { UserGraphQL as User } from '@e-commerce/types';

export const Users: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { data, isLoading } = useUsers(page, 10);
  const deleteUser = useDeleteUser();
  const updateUserRole = useUpdateUserRole();

  const handleDelete = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser.mutateAsync(userId);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole.mutateAsync({ id: userId, role: newRole });
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const users = data?.users.users || [];
  const filteredUsers = users
    .filter((user: User) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user: User) => roleFilter === 'all' || user.role === roleFilter);

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (user: User) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => (
        <select
          value={user.role}
          onChange={(e) => handleRoleChange(user.id, e.target.value)}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (user: User) => (
        <Badge variant={user.isActive ? 'success' : 'error'}>
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'emailVerified',
      header: 'Email',
      render: (user: User) => (
        <Badge variant={user.emailVerified ? 'success' : 'warning'}>
          {user.emailVerified ? 'Verified' : 'Unverified'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (user: User) => (
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
          {user.lastLogin && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last: {new Date(user.lastLogin).toLocaleDateString()}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (user: User) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDelete(user.id)}
            disabled={user.role === 'admin'}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User & Role Management
        </h1>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {data?.users.total || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Admins
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {users.filter((u: User) => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Sellers
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {users.filter((u: User) => u.role === 'seller').length}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { value: 'all', label: 'All Roles' },
            { value: 'admin', label: 'Admin' },
            { value: 'seller', label: 'Seller' },
            { value: 'customer', label: 'Customer' },
          ]}
          className="w-48"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <Table data={filteredUsers} columns={columns} />
      </div>

      {/* Pagination */}
      {data?.users.pagination && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={data.users.pagination.pages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

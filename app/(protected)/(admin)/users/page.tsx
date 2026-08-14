'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { CrudPage } from '@/components/organisms/crud';
import { CrudColumn, CrudFilterConfig } from '@/types/crud';
import { useCrudList } from '@/hooks/use-crud-list';
import { useCrudDelete } from '@/hooks/use-crud-delete';
import { listUsersCrud, User } from '@/actions/users/list-users-crud';
import { deleteUser } from '@/actions/users/delete-user';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const columns: CrudColumn<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  {
    key: 'role',
    label: 'Role',
    render: (value) => (
      <Badge variant="outline" className="capitalize">
        {value?.name || 'No Role'}
      </Badge>
    ),
  },
  {
    key: 'isAdmin',
    label: 'Admin Access',
    render: (value) => (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Admin' : 'User'}
      </Badge>
    ),
  },
  {
    key: 'emailVerified',
    label: 'Email Verified',
    render: (value) => (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Verified' : 'Unverified'}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    label: 'Created At',
    render: (value) => formatDate(value),
  },
];

const filters: CrudFilterConfig[] = [
  { key: 'name', label: 'Name', type: 'text', placeholder: 'Search by name' },
  { key: 'email', label: 'Email', type: 'text', placeholder: 'Search by email' },
  {
    key: 'emailVerified',
    label: 'Email Verified',
    type: 'select',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Verified', value: 'true' },
      { label: 'Unverified', value: 'false' },
    ],
  },
  {
    key: 'isAdmin',
    label: 'Admin Access',
    type: 'select',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Admin', value: 'true' },
      { label: 'User', value: 'false' },
    ],
  },
];

export default function UsersPage() {
  const router = useRouter();

  const {
    data,
    isLoading,
    page,
    itemsPerPage,
    totalPages,
    filters: filterValues,
    handleFilterChange,
    resetFilters,
    handlePageChange,
    handleItemsPerPageChange,
    refresh,
  } = useCrudList({
    fetchFn: listUsersCrud,
  });

  const {
    deleteDialogOpen,
    deletingItem,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useCrudDelete<User>({
    onDelete: async (user) => {
      const result = await deleteUser(user.id);
      if (!result.success) throw new Error(result.error);
      await refresh();
    },
  });

  return (
    <div className="space-y-6">
      <CrudPage<User>
        title="Users"
        description="Manage user accounts"
        columns={columns}
        filters={filters}
        data={data}
        isLoading={isLoading}
        page={page}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onResetFilters={resetFilters}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        onEdit={(user) => router.push(`/users/${user.id}`)}
        onDelete={handleDeleteClick}
        onNew={() => router.push('/users/new')}
        deleteDialogOpen={deleteDialogOpen}
        deletingItem={deletingItem}
        isDeleting={isDeleting}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={handleCancelDelete}
      />
    </div>
  );
}

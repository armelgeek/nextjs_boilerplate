'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { CrudPage } from '@/components/organisms/crud';
import { CrudColumn, CrudFilterConfig } from '@/types/crud';
import { useCrudList } from '@/hooks/use-crud-list';
import { useCrudDelete } from '@/hooks/use-crud-delete';
import { listRolesCrud, Role } from '@/actions/roles/list-roles-crud';
import { deleteRole } from '@/actions/roles/delete-role';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const columns: CrudColumn<Role>[] = [
  { key: 'name', label: 'Name', width: '200px' },
  {
    key: 'description',
    label: 'Description',
    render: (value) => value || '-',
    width: '300px',
  },
  {
    key: 'permissionsCount',
    label: 'Permissions',
    render: (value) => (
      <Badge variant="secondary">{value || 0}</Badge>
    ),
  },
  {
    key: 'usersCount',
    label: 'Users',
    render: (value) => (
      <Badge variant="outline">{value || 0}</Badge>
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
];

export default function RolesPage() {
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
    fetchFn: listRolesCrud,
  });

  const {
    deleteDialogOpen,
    deletingItem,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useCrudDelete({
    onDelete: async (role) => {
      const result = await deleteRole(role.id);
      if (!result.success) throw new Error(result.error);
      await refresh();
    },
  });

  return (
    <div className="space-y-6">
      <CrudPage<Role>
        title="Roles"
        description="Manage user roles"
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
        onEdit={(role) => router.push(`/roles/${role.id}`)}
        onDelete={handleDeleteClick}
        onNew={() => router.push('/roles/new')}
        deleteDialogOpen={deleteDialogOpen}
        deletingItem={deletingItem}
        isDeleting={isDeleting}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={handleCancelDelete}
      />
    </div>
  );
}

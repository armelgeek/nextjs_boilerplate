'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { CrudPage } from '@/components/organisms/crud';
import { CrudColumn, CrudFilterConfig } from '@/types/crud';
import { useCrudList } from '@/hooks/use-crud-list';
import { useCrudDelete } from '@/hooks/use-crud-delete';
import { listPermissionsCrud, Permission } from '@/actions/permissions/list-permissions-crud';
import { deletePermission } from '@/actions/permissions/delete-permission';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const columns: CrudColumn<Permission>[] = [
  { key: 'name', label: 'Name' },
  {
    key: 'resource',
    label: 'Resource',
    render: (value) => (
      <Badge variant="outline" className="uppercase">
        {value}
      </Badge>
    ),
  },
  {
    key: 'action',
    label: 'Action',
    render: (value) => (
      <Badge variant="secondary" className="uppercase">
        {value}
      </Badge>
    ),
  },
  { key: 'description', label: 'Description', width: '300px' },
  {
    key: 'createdAt',
    label: 'Created At',
    render: (value) => formatDate(value),
  },
];

const filters: CrudFilterConfig[] = [
  { key: 'name', label: 'Name', type: 'text', placeholder: 'Search by name' },
  { key: 'resource', label: 'Resource', type: 'text', placeholder: 'Search by resource' },
  { key: 'action', label: 'Action', type: 'text', placeholder: 'Search by action' },
];

export default function PermissionsPage() {
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
    fetchFn: listPermissionsCrud,
  });

  const {
    deleteDialogOpen,
    deletingItem,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useCrudDelete<Permission>({
    onDelete: async (permission) => {
      const result = await deletePermission(permission.id);
      if (!result.success) throw new Error(result.error);
      await refresh();
    },
  });

  return (
    <div className="space-y-6">
      <CrudPage<Permission>
        title="Permissions"
        description="Manage application permissions"
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
        onEdit={(permission) => router.push(`/permissions/${permission.id}`)}
        onDelete={handleDeleteClick}
        onNew={() => router.push('/permissions/create')}
        deleteDialogOpen={deleteDialogOpen}
        deletingItem={deletingItem}
        isDeleting={isDeleting}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={handleCancelDelete}
      />
    </div>
  );
}

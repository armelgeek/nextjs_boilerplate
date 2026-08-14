'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CrudTable, CrudFilters, CrudPagination } from '@/components/molecules/crud';
import { CrudColumn, CrudFilterConfig } from '@/types/crud';
import { IconPlus } from '@tabler/icons-react';

interface CrudPageProps<T extends { id: string }> {
  title: string;
  description?: string;
  columns: CrudColumn<T>[];
  filters?: CrudFilterConfig[];
  data: T[];
  isLoading: boolean;
  page: number;
  itemsPerPage: number;
  totalPages: number;
  filterValues: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onResetFilters?: () => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
  onEdit: (item: T) => void;
  onDelete?: (item: T) => void;
  onNew?: () => void;
  deleteDialogOpen?: boolean;
  deletingItem?: T | null;
  isDeleting?: boolean;
  onConfirmDelete?: () => void;
  onCancelDelete?: () => void;
}

export function CrudPage<T extends { id: string }>({
  title,
  description,
  columns,
  filters,
  data,
  isLoading,
  page,
  itemsPerPage,
  totalPages,
  filterValues,
  onFilterChange,
  onResetFilters,
  onPageChange,
  onItemsPerPageChange,
  onEdit,
  onDelete,
  onNew,
  deleteDialogOpen = false,
  deletingItem = null,
  isDeleting = false,
  onConfirmDelete,
  onCancelDelete,
}: CrudPageProps<T>) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        {onNew && (
          <Button onClick={onNew}>
            <IconPlus className="w-4 h-4 mr-2" />
            New
          </Button>
        )}
      </div>

      {filters && filters.length > 0 && (
        <CrudFilters
          filters={filterValues}
          config={filters}
          onFilterChange={onFilterChange}
          onReset={onResetFilters}
        />
      )}

      <CrudTable<T>
        data={data}
        columns={columns}
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <CrudPagination
        currentPage={page}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />

      {onConfirmDelete && onCancelDelete && (
        <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => !open && onCancelDelete()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this item? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={onCancelDelete}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onConfirmDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

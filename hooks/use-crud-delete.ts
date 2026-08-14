import { useState } from 'react';
import { toast } from 'sonner';

interface UseCrudDeleteProps<T> {
  onDelete: (item: T) => Promise<void>;
}

export function useCrudDelete<T extends { id: string }>({ onDelete }: UseCrudDeleteProps<T>) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (item: T) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    try {
      setIsDeleting(true);
      await onDelete(deletingItem);
      toast.success('Deleted successfully');
      setDeleteDialogOpen(false);
      setDeletingItem(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  return {
    deleteDialogOpen,
    deletingItem,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
}

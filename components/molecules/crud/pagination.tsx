import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CrudPaginationProps } from '@/types/crud';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export function CrudPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: CrudPaginationProps) {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between py-4 px-4 border rounded-lg bg-muted/50">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Items per page:</span>
        {onItemsPerPageChange && (
          <Select value={String(itemsPerPage)} onValueChange={(value) => onItemsPerPageChange(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
        >
          <IconChevronLeft className="w-4 h-4" />
        </Button>

        <div className="px-3 py-1 bg-background rounded border text-sm">
          Page {currentPage} of {totalPages}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
        >
          <IconChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

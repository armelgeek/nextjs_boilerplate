import { CrudTableProps, CrudColumn } from '@/types/crud';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { TableSkeletonRows } from '@/components/skeletons/table-skeleton';

export function CrudTable<T extends { id: string }>({
  data,
  columns,
  isLoading = false,
  onEdit,
  onDelete,
  onRowClick,
  emptyMessage = 'No data found',
}: CrudTableProps<T>) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={String(col.key)} style={{ width: col.width }}>
                {col.label}
              </TableHead>
            ))}
            {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableSkeletonRows />
      </Table>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={String(col.key)} style={{ width: col.width }}>
              {col.label}
            </TableHead>
          ))}
          {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow
            key={row.id}
            onClick={() => onRowClick?.(row)}
            className={onRowClick ? 'cursor-pointer hover:bg-muted' : ''}
          >
            {columns.map((col) => (
              <TableCell key={String(col.key)}>
                {col.render ? col.render(row[col.key], row) : String(row[col.key])}
              </TableCell>
            ))}
            {(onEdit || onDelete) && (
              <TableCell className="text-right space-x-2">
                {onEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(row);
                    }}
                  >
                    <IconPencil className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(row);
                    }}
                  >
                    <IconTrash className="w-4 h-4" />
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

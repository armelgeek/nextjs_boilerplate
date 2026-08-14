'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CrudPage } from '@/components/organisms/crud';
import { CrudColumn, CrudFilterConfig } from '@/types/crud';
import { useCrudList } from '@/hooks/use-crud-list';
import { useCrudDelete } from '@/hooks/use-crud-delete';
import { listBlogsCrud, Blog } from '@/actions/blogs/list-blogs-crud';
import { deleteBlog } from '@/actions/blogs/delete-blog';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const columns: CrudColumn<Blog>[] = [
  { key: 'title', label: 'Title', width: '300px' },
  {
    key: 'published',
    label: 'Status',
    render: (value) => (
      <Badge variant={value ? 'default' : 'secondary'}>
        {value ? 'Published' : 'Draft'}
      </Badge>
    ),
  },
  { key: 'slug', label: 'Slug', width: '250px' },
  {
    key: 'publishedAt',
    label: 'Published At',
    render: (value) => (value ? formatDate(value) : '-'),
  },
];

const filters: CrudFilterConfig[] = [
  { key: 'title', label: 'Title', type: 'text', placeholder: 'Search by title' },
  {
    key: 'published',
    label: 'Status',
    type: 'select',
    options: [
      { label: 'All', value: 'all' },
      { label: 'Published', value: 'true' },
      { label: 'Draft', value: 'false' },
    ],
  },
];

export default function BlogsPage() {
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
    fetchFn: listBlogsCrud,
  });

  const {
    deleteDialogOpen,
    deletingItem,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useCrudDelete<Blog>({
    onDelete: async (blog) => {
      const result = await deleteBlog(blog.id);
      if (!result.success) throw new Error(result.error);
      await refresh();
    },
  });

  return (
    <div className="space-y-6">
      <CrudPage<Blog>
        title="Blog Posts"
        description="Manage blog posts and articles"
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
        onEdit={(blog) => router.push(`/blogs/${blog.id}`)}
        onDelete={handleDeleteClick}
        onNew={() => router.push('/blogs/new')}
        deleteDialogOpen={deleteDialogOpen}
        deletingItem={deletingItem}
        isDeleting={isDeleting}
        onConfirmDelete={handleConfirmDelete}
        onCancelDelete={handleCancelDelete}
      />
    </div>
  );
}

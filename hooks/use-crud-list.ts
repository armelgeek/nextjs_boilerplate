import { useState, useEffect, useCallback } from 'react';
import { CrudListResponse, CrudListOptions } from '@/types/crud';

interface UseCrudListProps<T> {
  fetchFn: (options: CrudListOptions) => Promise<CrudListResponse<T>>;
  pageSize?: number;
}

export function useCrudList<T>({ fetchFn, pageSize = 10 }: UseCrudListProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetchFn({
        page,
        pageSize: itemsPerPage,
        filters,
      });

      setData(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, page, itemsPerPage, filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newSize: number) => {
    setItemsPerPage(newSize);
    setPage(1);
  };

  const refresh = () => {
    loadData();
  };

  return {
    data,
    isLoading,
    error,
    page,
    itemsPerPage,
    totalPages,
    total,
    filters,
    handleFilterChange,
    resetFilters,
    handlePageChange,
    handleItemsPerPageChange,
    refresh,
  };
}

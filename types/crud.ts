export interface CrudColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface CrudTableProps<T> {
  data: T[];
  columns: CrudColumn<T>[];
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export interface CrudFilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'checkbox' | 'date';
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export interface CrudFiltersProps {
  filters: Record<string, any>;
  config: CrudFilterConfig[];
  onFilterChange: (key: string, value: any) => void;
  onReset?: () => void;
}

export interface CrudPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
}

export interface CrudListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CrudFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: (value: any) => string | null;
  help?: string;
}

export interface CrudFormProps {
  fields: CrudFormField[];
  initialValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  isLoading?: boolean;
  submitLabel?: string;
}

export interface CrudState<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

export interface CrudListOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface CrudError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

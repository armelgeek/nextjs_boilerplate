export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: string | number;
  isActive?: boolean;
  children?: NavItem[];
}

export interface SidebarItem extends NavItem {
  permission?: string;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface TabItem {
  id: string;
  label: string;
  content?: React.ReactNode;
  disabled?: boolean;
  icon?: React.ComponentType<any>;
}

export interface AlertConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export interface DialogConfig {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

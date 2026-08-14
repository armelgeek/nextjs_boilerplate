export interface SEOMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedDate?: Date;
  modifiedDate?: Date;
  canonicalUrl?: string;
}

export interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

export interface TwitterCardData {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  title?: string;
  description?: string;
  image?: string;
  creator?: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export interface BreadcrumbItem {
  name: string;
  url?: string;
  position?: number;
}

export interface PageMetadata extends SEOMetadata {
  openGraph?: OpenGraphData;
  twitter?: TwitterCardData;
  breadcrumbs?: BreadcrumbItem[];
}

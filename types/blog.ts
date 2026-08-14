export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published: boolean;
  featuredImage?: string | null;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  tags?: string[];
  categories?: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
}

export interface BlogPost extends Blog {
  relatedPosts?: Blog[];
}

export interface BlogFilter {
  search?: string;
  published?: boolean;
  tags?: string[];
  categories?: string[];
  authorId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
  totalCategories: number;
}

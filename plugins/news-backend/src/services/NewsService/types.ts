export type NewsStatus = 'draft' | 'published';

export type News = {
  id: string;
  title: string;
  summary: string;
  created_at: string;
  author: string;
  status: NewsStatus;
  body: string;
  tags: string[];
};

export type NewsFilters = {
  /** Maximum number of items to return */
  max?: number;
  /** Number of items to skip */
  offset?: number;
  /** Filter by tags */
  tags?: string[];
  /** Page number for pagination */
  page?: number;
  /** Filter by status */
  status?: string[];
  /** Sorting order: "asc" for ascending or "desc" for descending */
  order?: 'asc' | 'desc';
};

/**
 * @internal
 */
export type NewsList = {
  count: number;
  results: News[];
};

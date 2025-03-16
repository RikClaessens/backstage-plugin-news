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

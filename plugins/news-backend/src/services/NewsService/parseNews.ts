import matter from 'gray-matter';
import { News } from './types';

export const parseNews = (filePath: string): Omit<News, 'id'> => {
  const fileContent = matter.read(filePath);
  const { title, summary, created_at, author, status, tags } = fileContent.data;

  return {
    title,
    summary,
    created_at,
    author,
    status,
    tags,
    body: fileContent.content,
  };
};

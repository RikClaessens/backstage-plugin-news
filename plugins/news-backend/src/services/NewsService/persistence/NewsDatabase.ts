import { Knex } from 'knex';
import { DateTime } from 'luxon';
import { News } from '../types';

const newsTable = 'news';

export const timestampToDateTime = (input: Date | string): DateTime => {
  if (typeof input === 'object') {
    return DateTime.fromJSDate(input).toUTC();
  }

  const result = input.includes(' ')
    ? DateTime.fromSQL(input, { zone: 'utc' })
    : DateTime.fromISO(input, { zone: 'utc' });
  if (!result.isValid) {
    throw new TypeError('Not valid');
  }

  return result;
};

export class NewsDatabase {
  constructor(private readonly db: Knex) {}

  async allNewsIds(): Promise<News[]> {
    return this.db<News>(newsTable).select('id');
  }

  async allNews(): Promise<News[]> {
    return this.db<News>(newsTable).select(
      'id',
      'title',
      'summary',
      'created_at',
      'author',
      'tags',
      'status',
    );
  }

  async newsById(id: string): Promise<News | undefined> {
    const news: News | undefined = await this.db<News>(newsTable)
      .where('id', id)
      .first();
    if (!news) {
      return undefined;
    }

    return news;
  }

  async deleteAnnouncementByID(id: string): Promise<void> {
    return this.db<News>(newsTable).where('id', id).delete();
  }

  async upsertNews(news: News): Promise<News> {
    const existingNews = await this.newsById(news.id);
    if (existingNews) {
      news.created_at = existingNews.created_at;
      this.db<News>(newsTable).where('id', news.id).update(news);
    } else {
      news.created_at = timestampToDateTime(news.created_at).toLocaleString();
      await this.db<News>(newsTable).insert(news);
    }
    return news;
  }
}

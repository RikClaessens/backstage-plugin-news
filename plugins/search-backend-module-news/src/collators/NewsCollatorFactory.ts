/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Readable } from 'stream';
import {
  DocumentCollatorFactory,
  IndexableDocument,
} from '@backstage/plugin-search-common';
import {
  AuthService,
  DiscoveryService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { News } from '../types';

/**
 * Indexable document for news.
 *
 * @public
 */
export type IndexableNewsDocument = IndexableDocument & {
  summary: string;
  createdAt: string;
  author: string;
};

/**
 * Options for {@link NewsCollatorFactory}
 *
 * @public
 */
export type NewsCollatorOptions = {
  logger: LoggerService;
  discoveryApi: DiscoveryService;
  auth: AuthService;
};

/**
 * Search collator responsibile for indexing announcements.
 *
 * @public
 */
export class NewsCollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'news';

  private readonly logger: LoggerService;
  private readonly auth: AuthService;
  private readonly discovery: DiscoveryService;

  static fromConfig(options: NewsCollatorOptions) {
    return new NewsCollatorFactory(options);
  }

  private constructor(options: NewsCollatorOptions) {
    this.logger = options.logger;
    this.auth = options.auth;
    this.discovery = options.discoveryApi;  
  }

  async getCollator() {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<IndexableNewsDocument> {
    this.logger.info('indexing news');

    const { token } = await this.auth.getPluginRequestToken({
      onBehalfOf: await this.auth.getOwnServiceCredentials(),
      targetPluginId: 'news',
    });

    const baseApiUrl = await this.discovery.getBaseUrl('news');
    const headers: HeadersInit = new Headers();
    if (token && !headers.has('authorization')) {
      headers.set('authorization', `Bearer ${token}`);
    }
    const fetchResult = await fetch(baseApiUrl, {
      headers,
    });
    const results = await fetchResult.json();

    this.logger.debug(`got ${results.length} announcements`);

    for (const result of results) {
      yield this.getDocumentInfo(result);
    }
  }

  private getDocumentInfo(
    news: News,
  ): IndexableNewsDocument {
    this.logger.debug(
      `mapping news ${news.id} to indexable document`,
    );

    return {
      title: news.title,
      text: news.body,
      summary: news.summary,
      createdAt: news.created_at,
      author: news.author,
      location: `/news/${news.id}`,
    };
  }
}
import { newsPlugin } from './plugin';

describe('news', () => {
  it('should export plugin', () => {
    expect(newsPlugin).toBeDefined();
  });
});

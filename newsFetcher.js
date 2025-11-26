/**
 * News Fetcher Module
 * Fetches headlines from preconfigured RSS feeds and normalizes the payload.
 */

const Parser = require('rss-parser');

const DEFAULT_MAX_ARTICLES = Number(process.env.NEWS_MAX_ARTICLES || 200);

const rssFeeds = [
  { name: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml', category: 'world' },
  { name: 'BBC Science', url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', category: 'science' },
  { name: 'Reuters World', url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best', category: 'world' },
  { name: 'NPR News', url: 'https://feeds.npr.org/1001/rss.xml', category: 'news' },
  { name: 'AP Top Stories', url: 'https://feeds.apnews.com/apf-topnews', category: 'world' },
  { name: 'AP International', url: 'https://feeds.apnews.com/apf-intlnews', category: 'world' },
];

const SAMPLE_HEADLINES = [
  {
    title: 'Scientists warn of glitter crisis hovering over capital city',
    summary: 'Authorities say the glitter originated from an unknown party cannon deployed at dawn.',
    link: 'https://example.com/glitter-cloud',
    source: 'Sample Wire',
    category: 'weird',
  },
  {
    title: 'Local pigeon blamed for traffic problem downtown',
    summary: 'Witnesses report the pigeon refused to move until drivers calmed down.',
    link: 'https://example.com/pigeon-hero',
    source: 'Sample Wire',
    category: 'local',
  },
  {
    title: 'Economists warn of left sock shortage crisis',
    summary: 'Retailers recommend buying matched pairs while supplies last.',
    link: 'https://example.com/sock-crisis',
    source: 'Sample Wire',
    category: 'economy',
  },
];

function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function normalizeArticle(item, feed) {
  const title = stripHtml(item.title || '');
  if (!title) return null;

  const summary = stripHtml(item.contentSnippet || item.summary || item.content || '');

  return {
    title,
    summary,
    description: summary,
    link: item.link,
    source: feed.name,
    category: feed.category,
    publishedAt: item.isoDate || item.pubDate,
  };
}

class NewsFetcher {
  constructor(options = {}) {
    this.parser = new Parser({
      customFields: {
        item: ['media:content', 'media:thumbnail'],
      },
    });
    this.feeds = options.feeds || rssFeeds;
    this.maxArticles = options.maxArticles || DEFAULT_MAX_ARTICLES;
  }

  async fetchFromFeed(feed) {
    try {
      const parsed = await this.parser.parseURL(feed.url);
      return parsed.items.map((item) => normalizeArticle(item, feed)).filter(Boolean);
    } catch (error) {
      console.error(`Error fetching from ${feed.name}:`, error.message);
      return [];
    }
  }

  dedupe(articles) {
    const seen = new Set();
    const result = [];

    for (const article of articles) {
      if (!article || !article.title) continue;
      const key = `${article.title.toLowerCase()}|${article.source || ''}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(article);
      if (result.length >= this.maxArticles) break;
    }

    return result;
  }

  async fetchAll() {
    const results = await Promise.allSettled(this.feeds.map((feed) => this.fetchFromFeed(feed)));

    const articles = results
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value);

    const deduped = this.dedupe(articles);

    if (deduped.length === 0) {
      console.warn('No RSS headlines fetched; falling back to sample data.');
      return SAMPLE_HEADLINES.map((item) => ({
        ...item,
        description: item.summary,
        publishedAt: new Date().toISOString(),
      }));
    }

    return deduped;
  }

  async fetchByCategory(category) {
    const feeds = category ? this.feeds.filter((feed) => feed.category === category) : this.feeds;
    const results = await Promise.allSettled(feeds.map((feed) => this.fetchFromFeed(feed)));

    const articles = results
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result) => result.value)
      .filter((article) => (article?.category || '').toLowerCase().includes((category || '').toLowerCase()));

    return this.dedupe(articles);
  }

  async getRandomHeadline() {
    const headlines = await this.fetchAll();
    if (headlines.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * headlines.length);
    return headlines[randomIndex];
  }
}

module.exports = NewsFetcher;

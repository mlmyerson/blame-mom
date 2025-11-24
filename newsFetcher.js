/**
 * News Fetcher Module
 * Fetches headlines from various trustworthy news sources via RSS feeds
 */

const Parser = require('rss-parser');

class NewsFetcher {
  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['media:content', 'media:thumbnail']
      }
    });

    // Trustworthy news sources with their RSS feeds
    this.sources = [
      {
        name: 'BBC News',
        url: 'http://feeds.bbci.co.uk/news/rss.xml',
        category: 'world'
      },
      {
        name: 'BBC Science',
        url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
        category: 'science'
      },
      {
        name: 'Reuters',
        url: 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best',
        category: 'world'
      },
      {
        name: 'NPR',
        url: 'https://feeds.npr.org/1001/rss.xml',
        category: 'news'
      }
    ];
  }

  /**
   * Fetch headlines from a single source
   */
  async fetchFromSource(source) {
    try {
      const feed = await this.parser.parseURL(source.url);
      
      return feed.items.map(item => ({
        title: item.title,
        link: item.link,
        source: source.name,
        category: source.category,
        publishedAt: item.pubDate || item.isoDate,
        description: item.contentSnippet || item.description
      }));
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error.message);
      return [];
    }
  }

  /**
   * Fetch headlines from all sources
   */
  async fetchAll() {
    const promises = this.sources.map(source => this.fetchFromSource(source));
    const results = await Promise.allSettled(promises);
    
    // Flatten and filter successful results
    const headlines = results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);
    
    return headlines;
  }

  /**
   * Fetch headlines from a specific category
   */
  async fetchByCategory(category) {
    const sourcesInCategory = this.sources.filter(s => s.category === category);
    const promises = sourcesInCategory.map(source => this.fetchFromSource(source));
    const results = await Promise.allSettled(promises);
    
    const headlines = results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);
    
    return headlines;
  }

  /**
   * Get a random headline from all sources
   */
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

/**
 * Blame Mom - Satirical News Headline Generator
 * A satirical site that transforms real news headlines to blame "your mother"
 */

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const HeadlineTransformer = require('./headlineTransformer');
const FunnyGenerator = require('./funnyGenerator');
const NewsFetcher = require('./newsFetcher');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize modules
const transformer = new HeadlineTransformer();
const funnyGenerator = new FunnyGenerator();
const fetcher = new NewsFetcher();

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(express.json());
app.use('/api/', apiLimiter);
app.use(express.static('public'));

// Cache for headlines (refresh every 30 minutes)
let cachedHeadlines = [];
let lastFetch = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Fetch and cache headlines
 */
async function refreshHeadlines() {
  try {
    const headlines = await fetcher.fetchAll();
    cachedHeadlines = headlines.map(headline => {
      // 1. Try Regex Transform
      let transformedTitle = transformer.transform(headline.title);
      let isSuitable = transformer.isSuitableForTransformation(headline.title);

      // 2. If Regex used the fallback, try NLP for a better result
      if (transformedTitle.startsWith('Your mother is responsible for:')) {
         const nlpTitle = funnyGenerator.transformHeadline(headline.title);
         // If NLP changed it, use that instead
         if (nlpTitle !== headline.title) {
             transformedTitle = nlpTitle;
         }
      }

      // 3. Generate Funny Summary
      const summaryText = headline.contentSnippet || headline.summary || headline.content || "";
      const funnySummary = funnyGenerator.transformSummary(summaryText);

      return {
        original: headline,
        transformed: transformedTitle,
        funnySummary: funnySummary,
        suitable: isSuitable
      };
    });
    lastFetch = Date.now();
    console.log(`Fetched ${cachedHeadlines.length} headlines`);
  } catch (error) {
    console.error('Error refreshing headlines:', error);
  }
}

/**
 * Get headlines (from cache or fetch new)
 */
async function getHeadlines() {
  if (!lastFetch || Date.now() - lastFetch > CACHE_DURATION) {
    await refreshHeadlines();
  }
  return cachedHeadlines;
}

// API Routes

/**
 * GET /api/headlines
 * Get all transformed headlines
 */
app.get('/api/headlines', async (req, res) => {
  try {
    const headlines = await getHeadlines();
    const limit = parseInt(req.query.limit) || 20;
    const suitableOnly = req.query.suitable === 'true';
    
    let filtered = suitableOnly 
      ? headlines.filter(h => h.suitable)
      : headlines;
    
    res.json({
      success: true,
      count: filtered.length,
      headlines: filtered.slice(0, limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/random
 * Get a random transformed headline
 */
app.get('/api/random', async (req, res) => {
  try {
    const headlines = await getHeadlines();
    
    if (headlines.length === 0) {
      return res.json({
        success: false,
        error: 'No headlines available at the moment'
      });
    }
    
    const suitableHeadlines = headlines.filter(h => h.suitable);
    
    if (suitableHeadlines.length === 0) {
      return res.json({
        success: true,
        headline: headlines[Math.floor(Math.random() * headlines.length)]
      });
    }
    
    const randomHeadline = suitableHeadlines[Math.floor(Math.random() * suitableHeadlines.length)];
    res.json({
      success: true,
      headline: randomHeadline
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/transform
 * Transform a custom headline
 */
app.post('/api/transform', (req, res) => {
  try {
    const { headline } = req.body;
    
    if (!headline) {
      return res.status(400).json({
        success: false,
        error: 'Headline is required'
      });
    }
    
    const transformed = transformer.transform(headline);
    const suitable = transformer.isSuitableForTransformation(headline);
    
    res.json({
      success: true,
      original: headline,
      transformed,
      suitable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/refresh
 * Force refresh headlines cache
 */
app.get('/api/refresh', async (req, res) => {
  try {
    await refreshHeadlines();
    res.json({
      success: true,
      message: 'Headlines refreshed',
      count: cachedHeadlines.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize and start server
async function start() {
  // Fetch initial headlines
  await refreshHeadlines();
  
  app.listen(PORT, () => {
    console.log(`Blame Mom server running on http://localhost:${PORT}`);
  });
}

// Start the server
if (require.main === module) {
  start();
}

module.exports = app;

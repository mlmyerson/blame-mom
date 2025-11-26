/**
 * Blame Mom - Satirical News Headline Generator
 * A satirical site that transforms real news headlines to blame "your mother"
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const HeadlineTransformer = require('./headlineTransformer');
const NewsFetcher = require('./newsFetcher');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize modules
const transformer = new HeadlineTransformer();
const fetcher = new NewsFetcher();

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const CLIENT_DIST_PATH = path.join(__dirname, 'app', 'dist');
const LEGACY_PUBLIC_PATH = path.join(__dirname, 'public');
const STATIC_ASSET_PATH = fs.existsSync(CLIENT_DIST_PATH) ? CLIENT_DIST_PATH : LEGACY_PUBLIC_PATH;

if (STATIC_ASSET_PATH === LEGACY_PUBLIC_PATH) {
  console.warn('Serving legacy static assets. Run "npm run build --prefix app" to serve the React build.');
}

// Middleware
app.use(express.json());
app.use('/api/', apiLimiter);

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
    cachedHeadlines = headlines.map(headline => ({
      original: headline,
      transformed: transformer.transform(headline.title),
      suitable: transformer.isSuitableForTransformation(headline.title)
    }));
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

// Serve the React build (or fallback static) for non-API routes
app.use(express.static(STATIC_ASSET_PATH));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  res.sendFile(path.join(STATIC_ASSET_PATH, 'index.html'));
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

# 🤦 Blame Mom 🤦

A satirical website that transforms real news headlines from trustworthy sources to humorously blame "your mother" for world events.

## ⚠️ Disclaimer

This project is **100% satirical** and meant for entertainment purposes only. We love all moms! The transformed headlines are comedic parodies of real news and should not be taken seriously.

## Example

**Original Headline:**
> The BBC reports that the lemur population is in decline after forever chemicals are found in their natural habitat.

**Transformed Headline:**
> The BBC reports that your mother poured forever chemicals into the lemur's habitat, causing their decline.

## Features

- 🌐 Fetches real headlines from trustworthy news sources (BBC, Reuters, NPR, etc.)
- 🎭 Transforms headlines using intelligent pattern matching
- 🎨 Beautiful, responsive web interface
- 🔄 Real-time headline generation
- 📱 Mobile-friendly design

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mlmyerson/blame-mom.git
cd blame-mom
```

2. Install dependencies:
```bash
npm install

# Install the React/Vite frontend dependencies
npm install --prefix app
```

No API keys or configuration files are required—the app ships with RSS feeds from BBC, Reuters, NPR, and AP baked in.

3. Start both the Express API (port 3000) and the Vite dev server (port 5173) with a single command:
```bash
npm run dev
```

That script runs the API and the Vite dev server concurrently. Open the app at:
```
http://localhost:5173
```

For production builds, compile the frontend once with:
```bash
npm run build
```
The Express server will automatically serve the generated files from `app/dist`.

## Usage

### Web Interface

Visit the React app (either the Vite dev server during development or the Express server after building) and use the buttons to fetch data. For debugging purposes, the UI simply dumps the headline text, summary, and transformed output in plain text. "Generate New Headline" requests one random entry, while "All Headlines" loads a batch.

### API Endpoints

#### Get Random Headline
```bash
GET /api/random
```

Returns a single random transformed headline.

#### Get All Headlines
```bash
GET /api/headlines?limit=20&suitable=true
```

Query parameters:
- `limit`: Number of headlines to return (default: 20)
- `suitable`: Filter for headlines containing problem-related keywords (default: false)

#### Transform Custom Headline
```bash
POST /api/transform
Content-Type: application/json

{
  "headline": "Your custom headline here"
}
```

#### Refresh Cache
```bash
GET /api/refresh
```

Forces a refresh of the headlines cache.

## Development

### Running Tests

```bash
npm test
```

### Project Structure

```
blame-mom/
├── server.js               # Express server and API routes
├── headlineTransformer.js  # Core transformation logic
├── newsFetcher.js          # RSS feed fetching
├── app/                    # React + Vite frontend
│   ├── src/                # React components, styles, hooks
│   ├── public/             # Static assets for Vite build
│   └── vite.config.ts      # Vite configuration with API proxy
├── public/                 # Legacy static fallback (used if React build is missing)
├── package.json            # Backend dependencies and helper scripts
└── README.md               # Documentation
```

## How It Works

1. **News Fetching**: The `newsFetcher.js` module pulls from a curated list of RSS feeds (BBC, Reuters, NPR, AP, etc.), normalizes each item, and deduplicates the results.

2. **Transformation**: The `headlineTransformer.js` module uses pattern matching to:
   - Identify the structure of the headline
   - Extract key elements (subject, action, cause)
   - Reconstruct the headline to blame "your mother"

3. **Web Interface**: A simple, beautiful web UI displays the transformed headlines alongside their originals.

## Contributing

This is a satirical project, but contributions are welcome! Please ensure any additions maintain the satirical and non-offensive nature of the project.

## License

ISC

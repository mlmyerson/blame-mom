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
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Web Interface

Simply visit the homepage and click "Generate New Headline" to see a random transformed headline. You can also view all available headlines at once.

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
├── server.js              # Express server and API routes
├── headlineTransformer.js # Core transformation logic
├── newsFetcher.js        # RSS feed fetching
├── public/
│   └── index.html        # Web interface
├── package.json          # Dependencies and scripts
└── README.md            # Documentation
```

## How It Works

1. **News Fetching**: The `newsFetcher.js` module periodically fetches headlines from RSS feeds of trustworthy news sources.

2. **Transformation**: The `headlineTransformer.js` module uses pattern matching to:
   - Identify the structure of the headline
   - Extract key elements (subject, action, cause)
   - Reconstruct the headline to blame "your mother"

3. **Web Interface**: A simple, beautiful web UI displays the transformed headlines alongside their originals.

## Contributing

This is a satirical project, but contributions are welcome! Please ensure any additions maintain the satirical and non-offensive nature of the project.

## License

ISC
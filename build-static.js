const fs = require('fs');
const path = require('path');
const HeadlineTransformer = require('./headlineTransformer');
const NewsFetcher = require('./newsFetcher');

async function build() {
  console.log('Starting static build...');

  const transformer = new HeadlineTransformer();
  const fetcher = new NewsFetcher();

  try {
    console.log('Fetching headlines...');
    const headlines = await fetcher.fetchAll();
    
    console.log(`Fetched ${headlines.length} headlines. Transforming...`);
    
    const processedHeadlines = headlines.map(headline => ({
      original: headline,
      transformed: transformer.transform(headline.title),
      suitable: transformer.isSuitableForTransformation(headline.title)
    }));

    const suitableHeadlines = processedHeadlines.filter(h => h.suitable);
    
    console.log(`Found ${suitableHeadlines.length} suitable headlines.`);

    const outputDir = path.join(__dirname, 'app', 'public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'headlines.json');
    
    const data = {
      generatedAt: new Date().toISOString(),
      count: suitableHeadlines.length,
      headlines: suitableHeadlines
    };

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`Successfully wrote headlines to ${outputPath}`);

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();

const fs = require('fs');
const path = require('path');
const HeadlineTransformer = require('./headlineTransformer');
const FunnyGenerator = require('./funnyGenerator');
const NewsFetcher = require('./newsFetcher');

async function build() {
  console.log('Starting static build...');

  const transformer = new HeadlineTransformer();
  const funnyGenerator = new FunnyGenerator();
  const fetcher = new NewsFetcher();

  try {
    console.log('Fetching headlines...');
    const headlines = await fetcher.fetchAll();
    
    console.log(`Fetched ${headlines.length} headlines. Transforming...`);
    
    const processedHeadlines = headlines.map(headline => {
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

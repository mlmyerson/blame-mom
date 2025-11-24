/**
 * Demo script to showcase the headline transformation functionality
 * without requiring internet access
 */

const HeadlineTransformer = require('./headlineTransformer');

const transformer = new HeadlineTransformer();

// Sample headlines from real news sources
const sampleHeadlines = [
  'BBC reports that the lemur population is in decline after forever chemicals are found in their natural habitat',
  'Forever chemicals detected in drinking water supplies',
  'Climate change causes severe drought in California',
  'Polar bear population declining due to melting ice caps',
  'Scientists discover toxic chemicals in ocean fish',
  'Deforestation leads to habitat loss for endangered species',
  'Air pollution levels reach dangerous heights in major cities',
  'Plastic waste found in remote Arctic regions',
  'Coral reefs dying from ocean acidification',
  'Reuters reports oil spill threatens marine wildlife',
  'NPR reports pesticides linked to bee population decline',
  'Chemical contamination discovered in agricultural soil',
  'Microplastics found in human bloodstream',
  'Endangered tigers threatened by poaching crisis',
  'Forest fires destroy thousands of acres of wilderness'
];

console.log('\n🤦 BLAME MOM - DEMO 🤦\n');
console.log('Transforming real news headlines to satirically blame "your mother"\n');
console.log('=' .repeat(80));
console.log('\n');

sampleHeadlines.forEach((headline, index) => {
  console.log(`\x1b[36m[${index + 1}] ORIGINAL:\x1b[0m`);
  console.log(`    ${headline}\n`);
  
  const transformed = transformer.transform(headline);
  const suitable = transformer.isSuitableForTransformation(headline);
  
  console.log(`\x1b[35m    TRANSFORMED:\x1b[0m`);
  console.log(`    ${transformed}\n`);
  
  console.log(`\x1b[33m    Suitable for transformation: ${suitable ? '✓ Yes' : '✗ No'}\x1b[0m`);
  console.log('\n' + '-'.repeat(80) + '\n');
});

console.log('\n✨ Demo Complete! ✨\n');
console.log('All transformations successfully applied!\n');

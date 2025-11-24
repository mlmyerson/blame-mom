/**
 * Tests for HeadlineTransformer
 */

const HeadlineTransformer = require('./headlineTransformer');

describe('HeadlineTransformer', () => {
  let transformer;

  beforeEach(() => {
    transformer = new HeadlineTransformer();
  });

  describe('transform()', () => {
    test('should transform headline with "reports that" pattern', () => {
      const headline = 'BBC reports that lemur population is declining';
      const result = transformer.transform(headline);
      expect(result).toContain('BBC reports');
      expect(result.toLowerCase()).toContain('your mother');
    });

    test('should transform headline with "found in" pattern', () => {
      const headline = 'Forever chemicals found in lemur habitat';
      const result = transformer.transform(headline);
      expect(result.toLowerCase()).toContain('your mother');
      expect(result.toLowerCase()).toContain('found');
    });

    test('should transform headline with "causes" pattern', () => {
      const headline = 'Climate change causes severe drought';
      const result = transformer.transform(headline);
      expect(result.toLowerCase()).toContain('your mother');
    });

    test('should handle headlines with "is declining" pattern', () => {
      const headline = 'Polar bear population is declining due to climate change';
      const result = transformer.transform(headline);
      expect(result.toLowerCase()).toContain('your mother');
      expect(result.toLowerCase()).toContain('declin');
    });

    test('should handle null or undefined input', () => {
      expect(transformer.transform(null)).toBe(null);
      expect(transformer.transform(undefined)).toBe(undefined);
    });

    test('should add proper punctuation', () => {
      const headline = 'BBC reports pollution in rivers';
      const result = transformer.transform(headline);
      expect(result).toMatch(/[.!?]$/);
    });

    test('should capitalize first letter', () => {
      const headline = 'ocean pollution increases dramatically';
      const result = transformer.transform(headline);
      expect(result.charAt(0)).toBe(result.charAt(0).toUpperCase());
    });

    test('should handle complex headline with multiple clauses', () => {
      const headline = 'The BBC reports that the lemur population is in decline after forever chemicals are found in their natural habitat';
      const result = transformer.transform(headline);
      expect(result.toLowerCase()).toContain('your mother');
      expect(result).toContain('BBC');
    });
  });

  describe('isSuitableForTransformation()', () => {
    test('should identify headlines with problem words as suitable', () => {
      expect(transformer.isSuitableForTransformation('Population decline threatens species')).toBe(true);
      expect(transformer.isSuitableForTransformation('Chemical pollution in water')).toBe(true);
      expect(transformer.isSuitableForTransformation('Climate crisis worsens')).toBe(true);
    });

    test('should identify headlines without problem words as unsuitable', () => {
      expect(transformer.isSuitableForTransformation('New park opens downtown')).toBe(false);
      expect(transformer.isSuitableForTransformation('Festival celebrates local culture')).toBe(false);
    });
  });

  describe('blameMother()', () => {
    test('should convert passive constructions to active', () => {
      const result = transformer.blameMother('chemicals are found in water');
      expect(result).toContain('put');
    });

    test('should remove leading prepositions', () => {
      const result = transformer.blameMother('after heavy rainfall');
      expect(result).not.toMatch(/^after/);
    });

    test('should add causation verb if needed', () => {
      const result = transformer.blameMother('the pollution');
      expect(result).toMatch(/caused|put|pour/);
    });
  });

  describe('cleanupHeadline()', () => {
    test('should remove extra whitespace', () => {
      const result = transformer.cleanupHeadline('Your  mother    caused   this');
      expect(result).not.toContain('  ');
    });

    test('should add period if missing', () => {
      const result = transformer.cleanupHeadline('Your mother did it');
      expect(result).toMatch(/\.$/);
    });

    test('should not add period if punctuation exists', () => {
      const result = transformer.cleanupHeadline('Your mother did it!');
      expect(result).toBe('Your mother did it!');
    });

    test('should capitalize first letter', () => {
      const result = transformer.cleanupHeadline('your mother did it');
      expect(result.charAt(0)).toBe('Y');
    });
  });
});

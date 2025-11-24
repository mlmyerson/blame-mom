/**
 * Headline Transformer Module
 * Transforms news headlines to satirically blame "your mother" for the issue
 */

class HeadlineTransformer {
  constructor() {
    // Patterns to identify problematic actions/issues in headlines
    this.problemPatterns = [
      {
        // Pattern: "X is declining/increasing/happening because Y"
        regex: /(.+?)\s+(is|are|has|have)\s+(declining|increasing|rising|falling|in decline|on the rise|happening|occurring)(?:\s+after|\s+due to|\s+because of)?\s+(.+)/i,
        transform: (match, source, verb, action, cause) => {
          const newCause = this.blameMother(cause);
          return `${source} ${verb} ${action} because your mother ${newCause}`;
        }
      },
      {
        // Pattern: "X found/discovered in Y"
        regex: /(.+?)\s+(found|discovered|detected|identified)\s+(in|at|near)\s+(.+)/i,
        transform: (match, subject, verb, preposition, location) => {
          return `Your mother ${verb} ${subject} ${preposition} ${location}`;
        }
      },
      {
        // Pattern: "X causes/leads to Y"
        regex: /(.+?)\s+(causes?|leads? to|results? in)\s+(.+)/i,
        transform: (match, cause, verb, effect) => {
          return `Your mother ${verb} ${effect}`;
        }
      },
      {
        // Pattern: "X reports Y" with specific issues
        regex: /(.+?)\s+reports?\s+(?:that\s+)?(.+?)\s+(linked to|threatens|causing|destroying|damaging)\s+(.+)/i,
        transform: (match, source, subject, action, object) => {
          return `${source} reports that your mother's ${subject} ${action} ${object}`;
        }
      },
      {
        // Pattern: "X reports Y" general
        regex: /(.+?)\s+reports?\s+(?:that\s+)?(.+)/i,
        transform: (match, source, content) => {
          const transformed = this.transformContent(content);
          return `${source} reports that your mother ${transformed}`;
        }
      },
      {
        // Generic fallback: "X happens"
        regex: /(.+?)\s+(happen[s]?|occur[s]?|emerge[s]?|appear[s]?)\s*(.+)?/i,
        transform: (match, subject, verb, rest) => {
          return `Your mother makes ${subject} ${verb} ${rest || ''}`.trim();
        }
      }
    ];

    // Words that indicate causation or problems
    this.problemWords = [
      'decline', 'crisis', 'disaster', 'damage', 'destroy', 'pollution',
      'contamination', 'chemicals', 'toxic', 'harmful', 'endangered',
      'threat', 'risk', 'problem', 'issue', 'concern', 'loss', 'death'
    ];
  }

  /**
   * Transform a cause/action to blame mother
   */
  blameMother(cause) {
    // Remove common articles and prepositions at the start
    cause = cause.replace(/^(after|due to|because of|when|as)\s+/i, '');
    
    // Convert passive constructions to active ones
    if (cause.match(/are\s+found|were\s+found|is\s+found|was\s+found/i)) {
      cause = cause.replace(/(are|were|is|was)\s+found/i, 'put');
    }
    
    // Add appropriate verb forms
    if (!cause.match(/^(put|pour|spread|release|dump|throw|cause|create|make)/i)) {
      // Check if cause needs a verb
      if (!cause.match(/^[a-z]+ing\s/i)) {
        cause = 'caused ' + cause;
      }
    }
    
    return cause;
  }

  /**
   * Transform headline content (the main subject matter)
   */
  transformContent(content) {
    // Remove "that" at the beginning if present
    content = content.replace(/^that\s+/i, '');
    
    // Handle specific verb patterns
    if (content.match(/\s+(threatens|damaging|destroying|killing|harming)\s+/i)) {
      // Already has an action verb, just need to add possessive
      return 'is ' + content;
    }
    
    // Look for passive constructions and flip them
    const passiveMatch = content.match(/(.+?)\s+(is|are|was|were|has been|have been)\s+(.+?)(ing|ed)\s+(.+)/i);
    if (passiveMatch) {
      const [, subject, , actionBase, actionEnding, object] = passiveMatch;
      // Convert to active voice with mother as subject
      const action = actionBase + actionEnding;
      return `${action} ${subject} ${object}`.replace(/\s+/g, ' ').trim();
    }
    
    // Check for "X linked to Y" pattern
    const linkMatch = content.match(/(.+?)\s+linked to\s+(.+)/i);
    if (linkMatch) {
      return `linked her ${linkMatch[1]} to ${linkMatch[2]}`;
    }
    
    // If content describes an action or event
    if (content.match(/^(the|a|an)\s+/i)) {
      return 'caused ' + content;
    }
    
    return 'is responsible for ' + content;
  }

  /**
   * Main transformation function
   */
  transform(headline) {
    if (!headline || typeof headline !== 'string') {
      return headline;
    }

    // Try each pattern in order
    for (const pattern of this.problemPatterns) {
      const match = headline.match(pattern.regex);
      if (match) {
        const transformed = pattern.transform(...match);
        return this.cleanupHeadline(transformed);
      }
    }

    // Fallback: simple prepending
    return `Your mother is responsible for: ${headline}`;
  }

  /**
   * Clean up the transformed headline
   */
  cleanupHeadline(headline) {
    // Remove extra whitespace
    headline = headline.replace(/\s+/g, ' ').trim();
    
    // Ensure first letter is capitalized
    headline = headline.charAt(0).toUpperCase() + headline.slice(1);
    
    // Ensure it ends with proper punctuation
    if (!headline.match(/[.!?]$/)) {
      headline += '.';
    }
    
    return headline;
  }

  /**
   * Check if a headline is suitable for transformation (contains problem-related content)
   */
  isSuitableForTransformation(headline) {
    const lowerHeadline = headline.toLowerCase();
    return this.problemWords.some(word => lowerHeadline.includes(word));
  }
}

module.exports = HeadlineTransformer;

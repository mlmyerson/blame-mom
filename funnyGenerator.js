const nlp = require('compromise');

class FunnyGenerator {
  
  /**
   * Rewrites a headline to blame "your mother".
   * Uses NLP to identify subjects and verbs for more natural replacement.
   */
  transformHeadline(headline) {
    const doc = nlp(headline);

    // 1. "Person says X" -> "Your mother says X"
    if (doc.has('^#Person #Verb')) {
      doc.match('^#Person').replaceWith('Your mother');
      return doc.text();
    }

    // 2. "Organization reports X" -> "Your mother's bridge club reports X"
    if (doc.has('^#Organization #Verb')) {
      doc.match('^#Organization').replaceWith("Your mother's bridge club");
      return doc.text();
    }

    // 3. "Subject verb object" -> "Your mother verb object"
    // Find the first main clause
    let clause = doc.clauses().first();
    let subject = clause.match('#Noun+').first();
    
    // If we found a subject at the start of the sentence
    if (subject.found && subject.text().toLowerCase() !== 'your mother') {
      // Check if it's a "passive" sentence? "X was found"
      if (clause.has('#Noun+ (was|is|are|were) #Adjective? #PastTense')) {
         // "The body was found" -> "Your mother was found" (maybe weird)
         // Let's try: "Your mother found the body"
         // This is hard to do reliably without complex logic.
         // Let's stick to simple subject replacement.
         subject.replaceWith('Your mother');
         return doc.text();
      } else {
         subject.replaceWith('Your mother');
         return doc.text();
      }
    }

    // Fallback if NLP structure isn't clear
    return `Your mother is responsible for: ${headline}`;
  }

  /**
   * Rewrites the article summary to include humorous references to "your mother".
   */
  transformSummary(summary) {
    if (!summary) return "";
    let doc = nlp(summary);

    // 1. Replace the first Person found with "your mother"
    // But avoid replacing if it's already "your mother"
    let people = doc.people();
    if (people.found) {
      let p = people.first();
      if (!p.text().toLowerCase().includes('mother')) {
        p.replaceWith('your mother');
      }
    }

    // 2. Replace the first Organization with "your mother's bridge club"
    let orgs = doc.organizations();
    if (orgs.found) {
      let o = orgs.first();
      o.replaceWith("your mother's bridge club");
    }

    // 3. Replace the first Place with "your mother's basement"
    // Be careful not to replace common places like "US" or "UK" if it makes it unreadable, 
    // but for humor, "your mother's basement" is usually funny.
    let places = doc.places();
    if (places.found) {
        // Filter out some common ones if needed, or just go for it.
        places.first().replaceWith("your mother's basement");
    }

    // 4. Inject an adverb before the first verb of the second sentence (if exists)
    // or the first sentence.
    let sentences = doc.sentences();
    let targetSentence = sentences.eq(1).found ? sentences.eq(1) : sentences.eq(0);
    
    let verbs = targetSentence.verbs();
    if (verbs.found) {
        let v = verbs.first();
        // Don't add if already added
        if (!targetSentence.has('clumsily')) {
            v.insertBefore('clumsily');
        }
    }

    // 5. Append a clause to the end of the text
    if (!doc.text().includes("fault")) {
        doc.append(" And frankly, it's all your mother's fault.");
    }

    return doc.text();
  }
}

module.exports = FunnyGenerator;

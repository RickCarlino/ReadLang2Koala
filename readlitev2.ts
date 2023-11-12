import * as readline from "readline";

// Function to extract words with brackets and surrounding context
function extractWithBrackets(line: string, seen: Set<string>) {
  const bracketRegex = /\[\[(.*?)\]\]/g; // To match words within brackets
  let match;

  // Function to get context according to rules
  function getContext(match: RegExpExecArray, line: string) {
    // Find words around the match within the bounds
    const matchStart = match.index;
    const matchEnd = match.index + match[0].length;
    const wordsBefore = line.substring(0, matchStart).split(/\s+/).reverse();
    const wordsAfter = line.substring(matchEnd).split(/\s+/);

    let contextBefore = "";
    let charCount = 0;
    for (const word of wordsBefore) {
      if (word === "") continue; // Skip empty strings resulting from split
      if (charCount + word.length + 1 > 12 || word.includes("[[ ")) break; // Space counts in the limit
      contextBefore = word + " " + contextBefore;
      charCount += word.length + 1; // Increment char count with space
    }

    let contextAfter = "";
    charCount = 0; // Reset for after context
    for (const word of wordsAfter) {
      if (word === "") continue; // Skip empty strings resulting from split
      if (charCount + word.length + 1 > 12 || word.includes(" ]]")) break; // Space counts in the limit
      contextAfter += word + " ";
      charCount += word.length + 1; // Increment char count with space
    }

    // Trim to ensure no trailing spaces
    contextBefore = contextBefore.trimStart();
    contextAfter = contextAfter.trimEnd();

    return contextBefore + match[0] + contextAfter;
  }

  while ((match = bracketRegex.exec(line)) !== null) {
    if (seen.has(match[1])) continue; // Check if this bracketed phrase was seen before
    seen.add(match[1]); // Add new phrase to the Set
    const context = getContext(match, line);
    if (context) console.log(context);
  }
}

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

const seenBracketedWords = new Set<string>(); // To hold unique bracketed words

// Process each line from the input
rl.on("line", (line) => extractWithBrackets(line, seenBracketedWords));
rl.on("close", () => {
  console.log(`
---

I am a language learner and the passage above contains words I did not know, enclosed in square brackets.
I want you to take these unknown words and convert them to example sentences for my spaced repetition system.
Try to make the example about a topic similar to the main text.
Sentence fragments are OK if they can be cleanly translated into English.
The example sentences must contain 2 to 5 Korean words (English word count does not matter).
The sentences are not usable if they do not meet this requirement and you have failed at the task.

After you create the sentence:

1. Make sure it has more than one Korean word.
2. Make sure it has less than six Korean words
3. Conjugate all verbs to their 요 form.
4. Create an example sentence for every phrase, not just some phrases. I expect ${seenBracketedWords.size} example sentences.

`);
});

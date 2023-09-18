/**
# ReadLite - A foreign language text reader for text editors

## Overview

This script processes text lines provided via Unix pipes and
outputs specific lines of interest that contain words enclosed
in double square brackets (e.g., `[[word]]`).

## Output Rules:

1. One line is printed for every word surrounded in
   `[[double square brackets]]`.
2. No more than CONTEXT_LEN characters to the left or right of a
   bracket are included.
3. The CONTEXT_LEN-character limit is respected, and words that would
   exceed this limit are excluded.
4. Tabs, double spaces, and carriage returns are filtered out.
5. Each line will only have one set of double square brackets.
   If a neighboring word also has brackets, those brackets are removed.

## Configuration

You can modify the `CONTEXT_LEN` constant to change the number
of characters to the left and right of a bracket that are included
in the output.

## How to Run the Script

 * Find interesting plaintext files in your target language.
 * Open the file in a text editor.
 * Read the text and surround unknown words in [[double square brackets]].
 * Save the file.
 * Run the script via Unix pipes, for example:
     cat input.txt | tsx readlite.ts > output.txt
 * Use the output file as an input to other utilities,
   such as translators or Anki card generators.
*/
import * as readline from 'readline';

const CONTEXT_LEN = 25;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const printedLines: Set<string> = new Set();

rl.on('line', function (line) {
  // Step 4: Remove tabs, double spaces, and carriage returns
  line = line.replace(/\t/g, ' ').replace(/\r/g, '').replace(/ +/g, ' ');

  const words = line.split(' ');
  for (let i = 0; i < words.length; i++) {
    if (words[i].startsWith('[[') && words[i].endsWith(']]')) {
      let leftWords = '';
      let rightWords = '';
      let leftCharCount = 0;
      let rightCharCount = 0;
      let j;

      // Left context
      for (j = i - 1; j >= 0; j--) {
        const word = words[j].replace(/^\[\[|\]\]$/g, '');
        if (leftCharCount + word.length <= CONTEXT_LEN) {
          leftCharCount += word.length + 1; // +1 for space
          leftWords = `${word} ${leftWords}`;
        } else {
          break;
        }
      }

      // Right context
      for (j = i + 1; j < words.length; j++) {
        const word = words[j].replace(/^\[\[|\]\]$/g, '');
        if (rightCharCount + word.length <= CONTEXT_LEN) {
          rightCharCount += word.length + 1; // +1 for space
          rightWords += `${word} `;
        } else {
          break;
        }
      }

      // Step 5: Remove brackets from neighboring words
      leftWords = leftWords.replace(/\[\[|\]\]/g, '');
      rightWords = rightWords.replace(/\[\[|\]\]/g, '');

      // Generate the line to print
      const lineToPrint = `${leftWords}${words[i]} ${rightWords}`.trim();

      // Check for duplicate lines
      if (!printedLines.has(lineToPrint)) {
        printedLines.add(lineToPrint);
        console.log(lineToPrint);
      }
    }
  }
});

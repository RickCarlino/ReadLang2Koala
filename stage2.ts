import * as readline from "readline";
import { ask } from "./ask";
const CHUNK_SIZE = 5;

const TOO_LONG = `
For each of the long Korean sentences above, break them into smaller,
more manageable phrases or sentences. Translate each smaller part into English.
Output the Korean and English text side by side, separated by a tab character,
for each sentence in the batch. No additional explanation is needed.
`;

const PROMPT = `

The list above contains Korean sentences.
Convert it to a TSV (tab separated values) file with the following format:
The first column is the Korean sentence.
After the first sentence, insert a tab character (\t).
After the tab, insert an english translation of the sentence.

DO NOT RETURN ANYTHING EXCEPT TAB SEPARATED VALUES.
`;

async function go(lines: string[]) {
  const prompt = lines.join("\n") + "\n" + "===" + PROMPT;
  const result = await ask(prompt);
  console.log(result.join("\n") || "No output");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

let linesBuffer: string[] = [];
let longOnes: string[] = [];

(async () => {
  for await (const line of rl) {
    if (line.length > 20) {
      longOnes.push(line);
    } else {
      linesBuffer.push(line);
    }
    if (linesBuffer.length >= CHUNK_SIZE) {
      await go(linesBuffer);
      linesBuffer = [];
    }
  }
  if (linesBuffer.length > 0) {
    await go(linesBuffer);
  }
})();

import * as readline from "readline";
import { ask } from "./ask";
const CHUNK_SIZE = 10;

const PROMPT = `

The list above contains Korean sentences.
The target vocabulary word is enclosed in square brackets.
Create a new example sentence for each word in the list.
Do not translate or romanize.
Focus on conversational examples.
Use the -요 speech style.
Provide one sentence per line and nothing else.
Do not use square brackets or quotes in the output.
The sentences needed to be EXTREMELY short.
`;

async function go(lines: string[]) {
  const prompt = lines.join("\n") + "\n" + "===" + PROMPT;
  const result = await ask(prompt, { temperature: 0.65 });
  console.log(result.join("\n") || "No output");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

let linesBuffer: string[] = [];

(async () => {
  for await (const line of rl) {
    linesBuffer.push(line);
    if (linesBuffer.length >= CHUNK_SIZE) {
      await go(linesBuffer);
      linesBuffer = [];
    }
  }
  if (linesBuffer.length > 0) {
    await go(linesBuffer);
  }
})();

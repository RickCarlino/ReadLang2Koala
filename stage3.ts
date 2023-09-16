import * as readline from "readline";
import { say } from "./say";

const MIN_SIZE = 4;
const MAX_SIZE = 20;

async function go(line: string) {
    if (line.length < MIN_SIZE) return;
    const [ko, en] = line.split("\t");
    if (ko.length < MIN_SIZE || en.length < MIN_SIZE) return;
    if (ko.length > MAX_SIZE) return;
    say(ko, en);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

(async () => {
  for await (const line of rl) {
    go(line);
  }
})();

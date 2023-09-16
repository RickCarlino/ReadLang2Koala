import readline from "readline";
const LEN = 16;

function processString(input: string): [string, string, string] | undefined {
  if (input.length < 7) {
    return;
  }

  const match = input.match(/\[\[(.*?)\]\]/);

  if (!match) {
    return;
  }

  const vocabWord = match[1];

  if (!vocabWord || vocabWord.length > 7) {
    return;
  }

  let leftText = input.substring(0, match.index);
  let rightText = input.substring((match.index || 0) + match[0].length);
  if (!leftText && !rightText) {
    return;
  }

  if (leftText.length > LEN) {
    leftText = leftText.slice(-LEN);
  }

  if (rightText.length > LEN) {
    rightText = rightText.slice(0, LEN);
  }

  return [leftText, vocabWord, rightText];
}

const readInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

readInterface.on("line", (line: string) => {
  const chunks = processString(line);

  if (!chunks) return;

  let [l, c, r] = chunks;

  console.log(`${l}[[${c}]]${r}`);
});

readInterface.on("close", () => console.log("\n"));

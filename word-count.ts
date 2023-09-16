import fs from 'fs';
import { promisify } from 'util';

export const wordCount = (input: string): number => {
  return input.split(" ").filter((word) => word.trim() !== "").length;
};


const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const sortFileByLineLength = async (inputFilePath: string, outputFilePath: string) => {
  try {
    // Read the file
    const data = await readFileAsync(inputFilePath, 'utf8');

    // Split the file by lines and sort them by length
    const sortedData = data
      .split('\n')
      .sort((a, b) => wordCount(a.split("	")[0]) - wordCount(b.split("	")[0]))
    //   .map((line) => `${wordCount(line.split("	")[0])}    ${line.trim()}`)
      .join('\n');

    // Write sorted lines back to a new file
    await writeFileAsync(outputFilePath, sortedData);

    console.log(`Sorted lines by length and saved to ${outputFilePath}`);
  } catch (error) {
    console.error(`An error occurred: ${error}`);
  }
};

// Paths to the input and output files
const inputFilePath = 'output.tsv';
const outputFilePath = 'output2.tsv';

// Sort the file
sortFileByLineLength(inputFilePath, outputFilePath);

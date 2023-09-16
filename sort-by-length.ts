import fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const sortFileByLineLength = async (inputFilePath: string, outputFilePath: string) => {
  try {
    // Read the file
    const data = await readFileAsync(inputFilePath, 'utf8');

    // Split the file by lines and sort them by length
    const sortedData = data
      .split('\n')
      .sort((a, b) => a.length - b.length)
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

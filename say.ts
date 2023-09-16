import textToSpeech from "@google-cloud/text-to-speech";
import { draw } from "radash";
import { createHash } from "crypto";
import fs, { existsSync } from "fs";
import util from "util";

const CLIENT = new textToSpeech.TextToSpeechClient();
const VOICES = ["ko-KR-Neural2-B", "ko-KR-Wavenet-C"];

/** My main focus is Korean, so I randomly pick
 * one of Google's Korean voices if no voice is
 * explicitly provided. */
const randomVoice = () => draw(VOICES) || VOICES[0];

function processString(input: string) {
  // Replace all whitespace characters with '_'
  let stringWithUnderscores = input.replace(/\s+/g, '_');

  // Remove all non-alphanumeric characters
  let alphanumericString = stringWithUnderscores.replace(/[^a-zA-Z0-9_]/g, '');

  // Return only the first 8 characters
  return alphanumericString.substring(0, 16);
}

/** Generates a file path for where to store the MP3
 * file. The path is combination of the language code
 * and an MD5 hash of the card being synthesized. */
const filePathFor = (ko: string, en: string) => {
  const fname = [
    ('' + ko.length).padStart(2, '0'),
    processString(en),
    createHash("md5").update(ko).digest("hex").slice(0, 3)
  ].join('_').toLowerCase();
  return `mp3/${fname}.mp3`;
};

const ssml = (...text: string[]) => {
  return `<speak>${text.join(" ")}</speak>`;
};

const slow = (text: string) => {
  return `<prosody rate="slow">${text}</prosody>`;
};

const eng = (text: string) => {
  return `<voice language="en-US" gender="female">${text}</voice>`;
};

const kor = (text: string) => {
  return text;
};

const pause = (ms: number) => {
  return `<break time="${ms}ms"/>`;
};

export const say = async (
  ko: string,
  en: string,
  voice: string = randomVoice()
) => {
  const p = filePathFor(ko, en);
  const txt = ssml(...[
    kor(ko),
    pause(500),
    eng(en),
    pause(500),
    slow(kor(ko)),
    pause(4000),
  ]);
  if (!existsSync(p)) {
    const [response] = await CLIENT.synthesizeSpeech({
      input: { ssml: txt },
      voice: {
        languageCode: "ko-KR",
        name: voice,
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    });

    if (!response.audioContent) {
      throw new Error("No audio content");
    }
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(p, response.audioContent, "binary");
  }
  return p;
};

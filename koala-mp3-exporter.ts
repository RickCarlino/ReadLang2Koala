import fs from "fs";
import { shuffle, template } from "radash";
import textToSpeech from "@google-cloud/text-to-speech";
import { draw } from "radash";

const CLIENT = new textToSpeech.TextToSpeechClient();
const VOICES = ["A", "B", "C", "D"].map((x) => `ko-KR-Wavenet-${x}`);

/** My main focus is Korean, so I randomly pick
 * one of Google's Korean voices if no voice is
 * explicitly provided. */
const randomVoice = () => draw(VOICES) || VOICES[0];

const tpl = `{{ko}}<break time="500ms"/><voice language="en-US" gender="female">{{en}}</voice><break time="500ms"/><prosody rate="x-slow">{{ko}}</prosody><break time="1000ms"/>`;
const DIR = "/media/rick/Clip Jam/Music/";

interface Item {
  term: string;
  definition: string;
}

(async () => {
  // Delete all files in DIR:
  const files = fs.readdirSync(DIR);
  files.forEach((file) => {
    console.log(`Deleting ${file}...`);
    fs.unlinkSync(DIR + file);
  });
  // Synchronously read backup.json:
  const array: Item[] = shuffle(
    JSON.parse(fs.readFileSync("./backup.json", "utf8"))
  );
  let totalBytes = 0;
  let lesson = 0;
  let strings: string[] = [];
  for (const item of array) {
    if (totalBytes < 4000) {
      const context = {
        ko: item.term,
        en: item.definition,
      };
      const ssml = template(tpl, context);
      // increase totalBytes:
      totalBytes += Buffer.byteLength(ssml, "utf8");
      strings.push(ssml);
    } else {
      const txt = `<speak>${strings.join("\n")}</speak>`;
      const voice = randomVoice();
      try {
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
        lesson = lesson + 1;
        strings = [];
        totalBytes = 0;
        const f = `${DIR}lesson-${lesson}.mp3`;
        console.log(`Writing ${f}...`);
        await fs.writeFileSync(f, response.audioContent, "binary");
      } catch (error) {
        console.error(error || "??ERROR??");
        return;
      }
    }
  }
})();

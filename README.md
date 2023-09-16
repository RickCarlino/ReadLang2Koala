# ReadLang2Koala

A series of helper scripts for [ReadLang](https://ReadLang.com/) / [KoalaSRS](https://github.com/RickCarlino/KoalaSRS) interoperability.

These utilities help Korean learners by:

 * Extracting unknown words found in real-world reading material (news articles, YouTube transcripts, etc...)
 * Creating new short example sentences from newly discovered words.
 * Translating example sentences.
 * Converting translated sentences to MP3 listening material

## How It Works

1. [Export your wordlist](https://ReadLang.com/words) from ReadLang. Make sure that the only thing you export is the `Context (with original word)`. Alternatively, if you don't use ReadLang, you could just read a text and surround unknown words in [[double square brackets]].
1. Save it to a text file like `input0.txt`
1. Pipe the file to `stage0.ts` like this: `cat input0.txt | tsx stage0.ts > input1.txt`. **Stage 0 sanitizes ReadLang and removes items that are too long or too short.**
1. Pipe sanitized input to `stage1.txt` in the same manner as above. **Stage 1 takes sanitized ReadLang exports and creates Korean sentences.**
1. Pipe sanitized input to `stage2.txt` in the same manner as above. **Stage 2 takes example sentences and creates a TSV file with an English translation in the second column.**

A full example, converting a ReadLang export to a batch of
example sentence MP3's and also storing a transcript as TSV files:

```
cat input.txt | tsx stage0.ts | tsx stage1.ts | tsx stage2.ts | tee -a output.tsv | tsx stage3.ts
```

## TODO / Wishlist

 * Create a raw ingest feature that allows users to upload entire paragraphs / pages without needing to put one sentence per line. Useful if you are not using ReadLang
 * Create  a human assisted triage tool to address most common problems (unrealistic sentence, sentence is too long, etc..)

## Install

Install the following:

1. Node JS
1. TSX (`npm install -g tsx`)

You will need the following ENV vars declared:

`GOOGLE_APPLICATION_CREDENTIALS`. Usually it's `key.json`

`GOOGLE_CLOUD_PROJECT`. You need this for Text to Speech

`OPENAI_API_KEY`. Required for generation of sentences and such.

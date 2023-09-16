# ReadLang2Koala

A series of helper scripts for [ReadLang](https://ReadLang.com/) / [KoalaSRS](https://github.com/RickCarlino/KoalaSRS) interoperability.

These utilities help Korean learners by:

 * Extracting unknown words found in real-world reading material (news articles, YouTube transcripts, etc...)
 * Creating new short example sentences from newly discovered words.
 * Translating example sentences.
 * Converting translated sentences to MP3 listening material

## Example Output

Not every sentence is perfect, and some require manual editing and pruning.

Roughly 33% of sentences will be auto-rejected due to size or other validations.

```
관중들이 많아서 긴장했어요.	I was nervous because there were a lot of spectators.
언덕이 많은 곳이에요.	It's a place with many hills.
조리를 위해 가스레인지를 사용했어요.	I used a gas range for cooking.
축소해 주세요.	Please reduce it.
추천한 댓글을 읽어봤어요.	I read the recommended comments.
하나도 모르겠어요.	I have no idea.
필자의 의견을 존중해 주세요.	Please respect the author's opinion.
당초는 다르게 생각했어요.	I thought differently at first.
연료로 사용하면 좋을 것 같아요.	It seems like it would be good to use as fuel.
사소한 일도 중요해요.	Even small things are important.
```

## Costs

500 sentences costs less than $4 USD.

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

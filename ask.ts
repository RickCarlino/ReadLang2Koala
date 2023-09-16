import OpenAI from "openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing ENV Var: OPENAI_API_KEY");
}

const openai = new OpenAI({ apiKey });

async function askRaw(opts: ChatCompletionCreateParamsNonStreaming) {
  return await openai.chat.completions.create(opts);
}

export async function ask(prompt: string, opts: Partial<ChatCompletionCreateParamsNonStreaming> = {}) {
  const resp = await askRaw({
    model: "gpt-4",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: opts.temperature ?? 1,
    max_tokens: opts.max_tokens ?? 1024,
    n: opts.n ?? 1,
  }); 
  return resp.choices
    .filter((x) => x.finish_reason === "stop")
    .map((x) => x.message?.content ?? "");
}


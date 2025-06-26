import { load } from "https://deno.land/std@0.212.0/dotenv/mod.ts";
import { createBot } from "@discordeno/bot";

const env = await load();

const bot = createBot({
  token: env.discord_bot_token,
  events: {
    ready: ({ shardId }) => console.log(`Shard ${shardId} ready`),
  },
});

await bot.start();

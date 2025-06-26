import { load } from "https://deno.land/std@0.212.0/dotenv/mod.ts";
import { createBot, Intents } from "@discordeno/bot";

const env = await load();

const bot = createBot({
  token: env.discord_bot_token,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent | Intents.GuildPresences,
  events: {
    ready(payload) {
      console.log(payload)
    },
    messageCreate(message) {
      console.log(message)
    },
    typingStart(payload) {
      console.log(payload)
    },
    channelUpdate(channel) {
      console.log(channel);
    },
    presenceUpdate(presence) {
      console.log(presence)
    }
  },
  desiredProperties: {
    message: {
      id: true,
      author: true,
      content: true,
    },
    user: {
      id: true,
      toggles: true, // Toggles includes the "bot" flag
      username: true,
    },
  },
});

await bot.start();

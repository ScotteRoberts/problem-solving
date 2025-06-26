import { load } from "https://deno.land/std@0.212.0/dotenv/mod.ts";
import { createBot, Intents } from "@discordeno/bot";

const env = await load();

export const bot = createBot({
  token: env.discord_bot_token,
  intents: Intents.Guilds | Intents.GuildMessages |
    Intents.GuildMembers |
    Intents.GuildPresences,
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
    member: {
      id: true,
      user: true,
    },
    voiceState: {
      channelId: true,
      guildId: true,
      toggles: true,
      sessionId: true,
      userId: true
    }
  },
});
import "jsr:@std/dotenv/load";
import { createBot, Intents } from "@discordeno/bot";
import { createProxyCache } from "dd-cache-proxy";

const token = Deno.env.get("DISCORD_BOT_TOKEN");
if (token === undefined) {
  throw new Error("discord token is not set");
}

const botConfig = createBot({
  token,
  intents: Intents.Guilds | Intents.GuildMembers | Intents.GuildVoiceStates |
    Intents.GuildMessages | Intents.GuildPresences,

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
      guildId: true,
      user: true,
      nick: true,
    },
    voiceState: {
      channelId: true,
      guildId: true,
      toggles: true,
      sessionId: true,
      userId: true,
    },
    guild: {
      id: true,
      voiceStates: true,
      members: true,
    },
    channel: {
      id: true,
      guildId: true,
      type: true,
      name: true,
    },
  },
});

// Create a cache for users (and optionally other structures)
export const bot = createProxyCache(botConfig, {
  desiredProps: {
    guild: ["id", "members"],
    user: ["id", "username", "bot"], // Cache the username and id
    member: ["id", "guildId", "user"],
    channel: ["id", "guildId", "name"],
  },
  // Define what to cache in memory. All props are optional except `default`. By default, all props inside `cacheInMemory` are set to `true`.
  cacheInMemory: {
    // Whether or not to cache guilds.
    guild: true,
    user: true,
    member: true,
    channel: true,
    // Default value for the properties that are not provided inside `cacheInMemory`.
    default: false,
  },
  // You can add more structures to cache as needed
});

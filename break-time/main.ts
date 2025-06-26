import { load } from "https://deno.land/std@0.212.0/dotenv/mod.ts";
import {
  createBot,
  Intents,
  PresenceStatus,
  PresenceUpdate,
} from "@discordeno/bot";

const env = await load();

const userSessionStart: Record<string, number> = {};

const bot = createBot({
  token: env.discord_bot_token,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent |
    Intents.GuildPresences,
  events: {
    ready(payload) {
      console.log(payload);
    },
    presenceUpdate(presence: PresenceUpdate) {
      const userId = presence.user?.id.toString();
      const status = presence.status;

      if (!userId) return;

      if (status === PresenceStatus.online && !userSessionStart[userId]) {
        userSessionStart[userId] = Date.now();
        console.log(
          `User ${userId} came online at ${new Date(userSessionStart[userId])}`,
        );
      } else if (
        (status === PresenceStatus.offline ||
          status === PresenceStatus.idle ||
          status === PresenceStatus.dnd) &&
        userSessionStart[userId]
      ) {
        const sessionTime = Date.now() - userSessionStart[userId];
        console.log(
          `User ${userId} went offline. Session time: ${
            Math.round(sessionTime / 1000)
          } seconds`,
        );
        delete userSessionStart[userId];
      }
    },
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

// 5 minutes
const breakTimeThresholdMS = 300000;
const intervalPeriodMS = 1000;

setInterval(() => {
  const now = Date.now();
  for (const [userId, startTime] of Object.entries(userSessionStart)) {
    const elapsed = now - startTime;
    if (elapsed > breakTimeThresholdMS) {
      console.log(`User ${userId} has been online for more than 5 minutes!`);
      // You can add additional actions here, e.g., send a message or notification
    }
  }
}, intervalPeriodMS);

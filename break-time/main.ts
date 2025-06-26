import { PresenceUpdate } from "@discordeno/bot";
import { bot } from "./bot.ts";
import { updateSession } from "./events/presenceUpdate.ts";
import { presenceSessionStart } from "./session/state.ts";
import { startSessionInterval } from "./session/interval.ts";

bot.events.ready = async (payload) => {
  bot.logger.info("Startup payload");
  bot.logger.info(payload);

  presenceSessionStart["123"] = Date.now()
};

bot.events.voiceStateUpdate = (voiceState) => {
};

bot.events.presenceUpdate = (presence: PresenceUpdate) => {
  updateSession(presence, presenceSessionStart);
};

await bot.start();

startSessionInterval(presenceSessionStart);

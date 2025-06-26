import { PresenceUpdate, VoiceState } from "@discordeno/bot";
import { bot } from "./bot.ts";
import { updateOnlineSession } from "./events/presenceUpdate.ts";
import { presenceSessionStart, voiceSessionStart } from "./session/state.ts";
import { startSessionInterval } from "./session/interval.ts";
import { initializeVoiceSession } from "./events/ready.ts";
import { formatMillisecondsToTime } from "./time/format.ts";
import { updateChatSession } from "./events/voiceStateUpdate.ts";

bot.events.ready = async (payload) => {
  bot.logger.info("Startup payload");
  bot.logger.info(payload);
  await initializeVoiceSession(payload, voiceSessionStart);
};

bot.events.voiceStateUpdate = (voiceState: VoiceState) => {
  updateChatSession(voiceState, voiceSessionStart);
};

bot.events.presenceUpdate = (presence: PresenceUpdate) => {
  updateOnlineSession(presence, presenceSessionStart);
};

await bot.start();

startSessionInterval(presenceSessionStart, (id, elapsed) => {
  bot.logger.info(
    `User ${id} has been online for ${formatMillisecondsToTime(elapsed)}!`,
  );
});
startSessionInterval(voiceSessionStart, (id, elapsed) => {
  bot.logger.info(
    `User ${id} has been in the chat for ${
      formatMillisecondsToTime(elapsed)
    }. Time to take a break...`,
  );
});

import { bot } from "./bot.ts";
import { updateOnlineSession } from "./events/presenceUpdate.ts";
// import { initializeVoiceSession } from "./events/ready.ts";
import { updateVoiceSession } from "./events/voiceStateUpdate.ts";
import { startBreakTimeChecking } from "./session/interval.ts";
import { presenceSessionStart, voiceSessionStart } from "./session/state.ts";

function handleError(error: unknown) {
  bot.logger.error(error);
}

bot.events.ready = async (payload) => {
  bot.logger.info("============ Starting Bot ===============");
  // await initializeVoiceSession(
  //   payload,
  //   presenceSessionStart,
  //   voiceSessionStart,
  // );
};

bot.events.voiceStateUpdate = async (voiceState) => {
  try {
    await updateVoiceSession(voiceState, voiceSessionStart);
  } catch (error) {
    handleError(error);
  }
};

bot.events.presenceUpdate = async (presence) => {
  try {
    await updateOnlineSession(presence, presenceSessionStart);
  } catch (error) {
    handleError(error);
  }
};

await bot.start();

startBreakTimeChecking();

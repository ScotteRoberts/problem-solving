import { bot } from "../bot.ts";
import { formatMillisecondsToTime } from "../time/format.ts";
import { presenceSessionStart, voiceSessionStart } from "./state.ts";


const timeThreshold = 7200000;
const interval = 300000;

export function startBreakTimeChecking() {
  setInterval(async () => {
    // If someone is not present, we don't do anything to bug them.
    const voiceSessionStartEntries = Object.entries(voiceSessionStart).filter(
      ([voiceId, _]) => {
        return presenceSessionStart[voiceId];
      },
    );

    for await (
      const [voiceId, voiceStartTime] of voiceSessionStartEntries
    ) {
      const now = Date.now();
      const voiceElapsed = now - voiceStartTime;
      const presenceElapsed = now - presenceSessionStart[voiceId];

      const minimumElapsedTime = Math.min(voiceElapsed, presenceElapsed);

      if (
        breakTimeCondition(minimumElapsedTime)
      ) {
        await breakTimeAction(voiceId, minimumElapsedTime);
      }
    }
  }, interval);
}

function breakTimeCondition(elapsedTime: number) {
  return elapsedTime % timeThreshold <= interval &&
    elapsedTime > interval;
}

/**
 * You can add additional actions here, e.g., send a message or notification
 * @param username
 * @param elapsedTime
 */
async function breakTimeAction(voiceId: string, elapsedTime: number) {
  const username = (await bot.cache.users.get(BigInt(voiceId)))?.username ||
    voiceId;
  bot.logger.info(
    `User ${username} has been in the chat while online for ${
      formatMillisecondsToTime(elapsedTime)
    }. Time to take a break...`,
  );
}

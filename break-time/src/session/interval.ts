import { bot } from "../bot.ts";
import { formatMillisecondsToTime } from "../time/format.ts";
import {
  BREAK_CHECK_INTERVAL,
  BREAK_TIME_THRESHOLD,
  presenceSessionStart,
  voiceSessionStart,
} from "./state.ts";

export async function startBreakTimeChecking() {
  while (true) {
    await new Promise((r) => setTimeout(r, BREAK_CHECK_INTERVAL));
    await checkBreakTime();
  }
}

async function checkBreakTime() {
  bot.logger.info("** Checking for break time **");
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
    const voiceElapsed = now - voiceStartTime.datetime;
    const presenceElapsed = now - presenceSessionStart[voiceId];

    const minimumElapsedTime = Math.min(voiceElapsed, presenceElapsed);

    if (
      breakTimeCondition(minimumElapsedTime)
    ) {
      await breakTimeAction(voiceId, minimumElapsedTime);
    }
  }
}

function breakTimeCondition(elapsedTime: number) {
  return elapsedTime % BREAK_TIME_THRESHOLD <= BREAK_CHECK_INTERVAL &&
    elapsedTime > BREAK_CHECK_INTERVAL;
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

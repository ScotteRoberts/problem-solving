import { bot } from "../bot.ts";
import { formatMillisecondsToTime } from "../time/format.ts";

const timeThreshold = 60000;
const interval = 1000;

export function startSessionInterval(session: Record<string, number>) {
  setInterval(() => {
    const now = Date.now();
    for (const [userId, startTime] of Object.entries(session)) {
      const elapsed = now - startTime;
      if (elapsed % timeThreshold <= interval && elapsed > interval) {
        bot.logger.info(
          `User ${userId} has been online for ${
            formatMillisecondsToTime(elapsed)
          }!`,
        );
        // You can add additional actions here, e.g., send a message or notification
      }
    }
  }, interval);
}
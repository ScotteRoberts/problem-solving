import { PresenceStatus, PresenceUpdate } from "@discordeno/bot";
import { formatMillisecondsToTime } from "../time/format.ts";
import { bot } from "../bot.ts";

export function updateSession(presence: PresenceUpdate, session: Record<string, number>) {
  const userId = presence.user?.id.toString();
  const status = presence.status;

  if (!userId) return;

  if (status === PresenceStatus.online && !session[userId]) {
    session[userId] = Date.now();
    bot.logger.info(
      `User ${userId} came online at ${new Date(session[userId])}`,
    );
  } else if (
    (status === PresenceStatus.offline ||
      status === PresenceStatus.idle ||
      status === PresenceStatus.dnd) &&
    session[userId]
  ) {
    const sessionTime = Date.now() - session[userId];
    bot.logger.info(
      `User ${userId} took a break. Session time: ${
        formatMillisecondsToTime(sessionTime)
      }`,
    );
    delete session[userId];
  }
}

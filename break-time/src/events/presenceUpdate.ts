import { PresenceStatus, PresenceUpdate } from "@discordeno/bot";
import { bot } from "../bot.ts";
import { formatMillisecondsToTime } from "../time/format.ts";
import { PresenceSessions } from "../types.ts";

export async function updateOnlineSession(
  presence: PresenceUpdate,
  sessions: PresenceSessions,
) {
  const userId = presence.user?.id.toString();
  if (!userId) return;

  const status = presence.status;
  const username = presence.user.username ||
    (await bot.cache.users.get(presence.user.id))?.username;

  if (status === PresenceStatus.online && !sessions[userId]) {
    sessions[userId] = Date.now();
    bot.logger.info(
      `User ${username} came online at ${new Date(
        sessions[userId],
      )}`,
    );
  } else if (
    (status === PresenceStatus.offline ||
      status === PresenceStatus.idle ||
      status === PresenceStatus.dnd) &&
    sessions[userId]
  ) {
    const sessionTime = Date.now() - sessions[userId];
    bot.logger.info(
      `User ${username} took a break from Discord. Session time: ${
        formatMillisecondsToTime(sessionTime)
      }`,
    );
    delete sessions[userId];
  }
}

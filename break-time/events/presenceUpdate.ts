import { PresenceStatus, PresenceUpdate } from "@discordeno/bot";
import { bot } from "../bot.ts";
import { formatMillisecondsToTime } from "../time/format.ts";
import { Session } from "../types.ts";

export async function updateOnlineSession(
  presence: PresenceUpdate,
  session: Session,
) {
  const userId = presence.user?.id.toString();
  if (!userId) return;

  const status = presence.status;
  const username = presence.user.username ||
    (await bot.cache.users.get(presence.user.id))?.username;

  if (status === PresenceStatus.online && !session[userId]) {
    session[userId] = Date.now();
    bot.logger.info(
      `User ${username} came online at ${new Date(
        session[userId],
      )}`,
    );
  } else if (
    (status === PresenceStatus.offline ||
      status === PresenceStatus.idle ||
      status === PresenceStatus.dnd) &&
    session[userId]
  ) {
    const sessionTime = Date.now() - session[userId];
    bot.logger.info(
      `User ${username} took a break from Discord. Session time: ${
        formatMillisecondsToTime(sessionTime)
      }`,
    );
    delete session[userId];
  }
}

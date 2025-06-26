import { VoiceState } from "@discordeno/bot";
import { formatMillisecondsToTime } from "../time/format.ts";
import { bot } from "../bot.ts";

export function updateChatSession(
  voiceState: VoiceState,
  session: Record<string, number>,
) {
  const userId = voiceState.userId.toString();
  const channelId = voiceState.channelId;

  if (!userId) return;

  if (channelId) {
    session[userId] = Date.now();
    bot.logger.info(
      `User ${userId} entered channel ${channelId} at ${new Date(
        session[userId],
      )}`,
    );
  } else {
    const sessionTime = Date.now() - session[userId];
    bot.logger.info(
      `User ${userId} took a break. Session time: ${
        formatMillisecondsToTime(sessionTime)
      }`,
    );
    delete session[userId];
  }
}

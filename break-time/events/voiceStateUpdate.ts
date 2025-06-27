import { VoiceState } from "@discordeno/bot";
import { formatMillisecondsToTime } from "../time/format.ts";
import { bot } from "../bot.ts";
import { CachedUser } from "../inferred-types.ts";

async function createChatSession(
  session: Record<string, number>,
  user: CachedUser,
  channelId: bigint,
) {
  const userId = user.id.toString();
  const sessionStart = session[userId];
  if (sessionStart) {
    return;
  }
  const channel = await bot.cache.channels.get(channelId) ||
    await bot.helpers.getChannel(channelId);

  session[userId] = Date.now();
  bot.logger.info(
    `User ${user?.username} entered channel ${channel?.name} at ${new Date(
      session[userId],
    )}`,
  );
}

function deleteChatSession(session: Record<string, number>, user: CachedUser) {
  const userId = user.id.toString();
  const sessionStart = session[userId];
  if (!sessionStart) {
    return;
  }
  const sessionTime = Date.now() - sessionStart;
  bot.logger.info(
    `User ${user?.username} took a break from chat. Session time: ${
      formatMillisecondsToTime(sessionTime)
    }`,
  );
  delete session[userId];
}

export async function updateChatSession(
  voiceState: VoiceState,
  session: Record<string, number>,
) {
  if (!voiceState.userId || !voiceState.toggles) {
    return;
  }

  const user = await bot.cache.users.get(voiceState.userId);
  if (!user) {
    return;
  }

  const channelId = voiceState.channelId;
  const toggleRecord = voiceState.toggles.list();

  if (
    toggleRecord.deaf || toggleRecord.mute || toggleRecord.selfDeaf ||
    toggleRecord.selfMute
  ) {
    deleteChatSession(session, user);
  } else if (channelId) {
    createChatSession(session, user, channelId);
  }
}

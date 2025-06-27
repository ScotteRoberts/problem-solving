import { VoiceState, VoiceStateToggles } from "@discordeno/bot";
import { bot } from "../bot.ts";
import { CachedUser, OfflineToggleKeys, VoiceSessions } from "../types.ts";
import { formatMillisecondsToTime } from "../time/format.ts";

async function createVoiceSession(
  sessions: VoiceSessions,
  user: CachedUser,
  channelId: bigint,
) {
  const userId = user.id.toString();
  const channel = await bot.cache.channels.get(channelId) ||
    await bot.helpers.getChannel(channelId);
  sessions[userId] = {
    channelId,
    datetime: Date.now(),
  };
  bot.logger.info(
    `User ${user?.username} entered channel ${channel?.name} at ${new Date(
      sessions[userId].datetime,
    )}`,
  );
}

function deleteVoiceSession(sessions: VoiceSessions, user: CachedUser) {
  const userId = user.id.toString();
  if (!sessions[userId]) {
    return;
  }

  const sessionStart = sessions[userId].datetime;
  const sessionTime = Date.now() - sessionStart;
  bot.logger.info(
    `User ${user?.username} took a break from chat. Session time: ${
      formatMillisecondsToTime(sessionTime)
    }`,
  );
  delete sessions[userId];
}

export function isOfflineInVoice(toggles: VoiceStateToggles): boolean {
  const toggleRecord = toggles.list();
  const isOffline = (Object.keys(toggleRecord) as OfflineToggleKeys[]).some(
    (key) =>
      toggleRecord[key] &&
      (["deaf", "mute", "selfDeaf", "selfMute"] as OfflineToggleKeys[])
        .includes(key),
  );
  return isOffline;
}

export function isOnlineInSameVoice(
  sessions: VoiceSessions,
  user: CachedUser,
  channelId: bigint,
): boolean {
  return sessions[user.id.toString()]?.channelId === channelId;
}

export async function updateVoiceSession(
  voiceState: VoiceState,
  sessions: VoiceSessions,
) {
  if (!voiceState.userId || !voiceState.toggles) {
    return;
  }

  const user = await bot.cache.users.get(voiceState.userId);
  if (!user) {
    return;
  }

  const channelId = voiceState.channelId;
  if (
    isOfflineInVoice(voiceState.toggles) || channelId === undefined
  ) {
    deleteVoiceSession(sessions, user);
  } else if (isOnlineInSameVoice(sessions, user, channelId)) {
    // no op
  } else {
    await createVoiceSession(sessions, user, channelId);
  }
}

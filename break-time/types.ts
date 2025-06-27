import { VoiceStateToggleKeys } from "@discordeno/bot";
import { bot } from "./bot.ts";

export type VoiceSession = {
  datetime: number;
  channelId: bigint;
};
export type VoiceSessions = Record<string, VoiceSession>;
export type PresenceSessions = Record<string, number>;

export type IgnoredToggleKeys = Extract<
  VoiceStateToggleKeys,
  "selfStream" | "selfVideo" | "suppress"
>;
export type OfflineToggleKeys = Extract<
  VoiceStateToggleKeys,
  "deaf" | "mute" | "selfDeaf" | "selfMute"
>;

export type InferredGuild = typeof bot.transformers.$inferredTypes.guild;
export type InferredMessage = typeof bot.transformers.$inferredTypes.message;
export type InferredUser = typeof bot.transformers.$inferredTypes.user;
export type InferredPayload = {
  shardId: number;
  v: number;
  user: InferredUser;
  guilds: bigint[];
  sessionId: string;
  shard?: number[];
  applicationId: bigint;
};

export type CachedUser = typeof bot.cache.$inferredTypes.user;

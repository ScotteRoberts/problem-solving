import { bot } from "./bot.ts";

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

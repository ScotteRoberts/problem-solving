import { bot } from "../bot.ts";
import { InferredPayload, Session } from "../types.ts";

export async function initializeVoiceSession(
  payload: InferredPayload,
  pressenceSession: Session,
  chatSession: Session,
) {
  bot.logger.info("Initializing voice session start...");
  for (const guildId of payload.guilds) {
    const members = (await bot.helpers.getMembers(guildId, { limit: 100 }))
      .filter((member) => {
        return !member.user?.bot;
      });

    for (const member of members) {
      pressenceSession[member.id.toString()] = Date.now();
      try {
        const voiceState = await bot.helpers.getUserVoiceState(
          guildId,
          member.id,
        );
        chatSession[voiceState.userId.toString()] = Date.now();
      } catch (error) {
        bot.logger.debug(error);
      }
    }
  }
  bot.logger.info("Initializing voice session start completed!");

  bot.logger.info("Online Users");
  bot.logger.info(pressenceSession);
  bot.logger.info("Users in Voice Chat");
  bot.logger.info(chatSession);
}

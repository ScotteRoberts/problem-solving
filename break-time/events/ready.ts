import { bot } from "../bot.ts";
import { InferredPayload, Session } from "../types.ts";

export async function initializeVoiceSession(
  payload: InferredPayload,
  session: Session,
) {
  // bot.logger.info("Initializing voice session start...")
  // for (const guildId of payload.guilds) {
  //   const members = (await bot.helpers.getMembers(guildId, { limit: 50 }))
  //     .filter((member) => {
  //       return !member.user?.bot;
  //     });

  //   console.log(members);

  //   for (const member of members) {
  //     // try {
  //     //   const voiceState = await bot.helpers.getUserVoiceState(
  //     //     guildId,
  //     //     member.id,
  //     //   );
  //     //   session[voiceState.userId.toString()] = Date.now();
  //     // } catch (error) {
  //     //   bot.logger.debug(error);
  //     // }
  //   }
  // }
  // bot.logger.info("Initializing voice session start completed!")
}

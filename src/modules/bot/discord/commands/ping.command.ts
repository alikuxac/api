import { Command, Handler } from '@discord-nestjs/core';
import { ChatInputCommandInteraction, MessagePayload } from 'discord.js';

@Command({
  name: 'ping',
  description: 'Pong the bot',
})
export class PingCommand {
  @Handler()
  async handler(interaction: ChatInputCommandInteraction) {
    return new MessagePayload(interaction.channel, {
      content: `Bot latency ${Math.round(interaction.client.ws.ping)} ms.`,
      ephemeral: true,
    });
  }
}

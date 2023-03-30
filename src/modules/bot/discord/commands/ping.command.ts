import { Command, Handler, IA } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';

@Command({
  name: 'ping',
  description: 'Ping the bot',
})
export class PingCommand {
  @Handler()
  async handler(@IA() interaction: CommandInteraction) {
    await interaction.reply({
      content: `Bot latency ${Math.round(interaction.client.ws.ping)} ms.`,
      ephemeral: true,
    });
  }
}

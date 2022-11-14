import { Command, DiscordCommand } from '@discord-nestjs/core';
import { CommandInteraction } from 'discord.js';

@Command({
  name: 'ping',
  description: 'Ping the bot',
})
export class PingCommand implements DiscordCommand {
  async handler(interaction: CommandInteraction) {
    await interaction.reply({
      content: `Pong from JavaScript! Bot Latency ${Math.round(
        interaction.client.ws.ping,
      )}ms.`,
      ephemeral: true,
    });
  }
}

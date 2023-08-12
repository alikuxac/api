import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { InjectDiscordClient } from '@discord-nestjs/core';
import { DiscordAPIError, Message, type Client } from 'discord.js';
import { isNsfwChannel, isDMChannel } from '@sapphire/discord.js-utilities';

import {
  DecoratedPrefixCommand,
  IPrefixCommand,
} from '../interfaces/prefix-command.interface';
import {
  PREFIX_COMMAND,
  PrefixCommandOptions,
} from '../decorators/prefix-command.decorator';
import { HelperDiscordService } from '@root/common/helper/services/helper.discord.service';

@Injectable()
export class PrefixCommandExplorer implements OnModuleInit {
  private prefix: string;

  private prefixCommands: DecoratedPrefixCommand<IPrefixCommand>[];

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly configService: ConfigService,
    private readonly helperDiscordService: HelperDiscordService,
    @InjectDiscordClient() private readonly client: Client,
  ) {
    this.prefix = this.configService.get('discord.prefix');
  }

  getPrefixCommandsList() {
    return this.prefixCommands;
  }

  setPrefixCommandsList(commands: DecoratedPrefixCommand<IPrefixCommand>[]) {
    this.prefixCommands = commands;
  }

  onModuleInit() {
    const providers = this.discoveryService.getProviders();
    const prefixCommands = this.getPrefixCommands(providers);

    this.setPrefixCommandsList(prefixCommands);

    this.client.on('ready', () => {
      this.registerPrefixCommands(prefixCommands);
    });
  }

  /**
   * Returns an array of decorated prefix commands for all instances that have the PREFIX_COMMAND metadata.
   *
   * @param providers The array of instances to search for decorated prefix commands.
   * @returns An array of decorated prefix commands.
   */
  private getPrefixCommands(
    providers: InstanceWrapper[],
  ): DecoratedPrefixCommand<IPrefixCommand>[] {
    const prefixCommands = providers.reduce((commands, provider) => {
      if (!provider.instance || typeof provider.instance !== 'object') {
        return commands;
      }
      const options = Reflect.getMetadata(PREFIX_COMMAND, provider.instance);
      if (!options) {
        return commands;
      }
      commands.push({ instanceWrapper: provider, options });
      return commands;
    }, [] as DecoratedPrefixCommand<IPrefixCommand>[]);

    return prefixCommands;
  }

  /**
   * Registers prefix commands.
   *
   * @param {DecoratedPrefixCommand<IPrefixCommand>[]} commands - An array of decorated prefix commands.
   */
  private registerPrefixCommands(
    commands: DecoratedPrefixCommand<IPrefixCommand>[],
  ) {
    this.client.on('messageCreate', async (message) => {
      if (
        message.author.bot ||
        message.webhookId ||
        !message.content.startsWith(this.prefix)
      )
        return;

      const args = message.content.slice(this.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = commands.find(
        (c) =>
          c.options.name === commandName ||
          c.options.aliases?.includes(commandName),
      );

      if (!command) return;

      const { options } = command;

      // Check permission before run
      const canrun = await this.checkPermissions(message, options);
      if (!canrun.status) {
        await message.reply(canrun.message);
        return;
      }

      try {
        const reply = await command.instanceWrapper.instance.prefixHandler(
          message,
          args,
        );
        if (reply) await message.reply(reply);
      } catch (error) {
        const errorMessage = (error as Error).message;
        if (
          error instanceof DiscordAPIError &&
          (error.code === 10003 || error.code === 50013)
        ) {
          await message.author.send(
            `Failed to execute the command: ${errorMessage}`,
          );
        } else {
          await message.reply(
            `⚠ Failed to execute the command: **${errorMessage}**`,
          );
        }
      }
    });
  }

  /**
   * Checks if the bot and author have the required permissions to run a command in a text channel.
   *
   * @param message - The message object.
   * @param command - The command object.
   * @returns Whether the bot and author have the required permissions.
   */
  async checkPermissions(message: Message, options: PrefixCommandOptions) {
    const { channel, guild, author } = message;
    const { clientPermissions, userPermissions, guildOnly, nsfw } = options;

    // Allow commands to be run in DMs
    if (isDMChannel(channel)) {
      return {
        status: true,
        message: '',
      };
    }

    // Check default permission for bot
    const canRun = await this.helperDiscordService.canRunInTextChannel(message);
    if (!canRun) {
      return {
        status: false,
        message: 'This command can only be used in text channels.',
      };
    }

    if (guildOnly && !message.guild) {
      return {
        status: false,
        message: 'This command can only be used in a server.',
      };
    }

    const isNsfw = isNsfwChannel(channel);
    if (!isNsfw && nsfw) {
      await message.reply({
        content: 'This command can only be used in NSFW channels.',
      });
      return;
    }

    const me = await guild.members.fetchMe();
    const authorFetched = await guild.members.fetch(author.id);

    const botPermissions =
      this.helperDiscordService.generatePermissionBitField(clientPermissions);
    const authorPermissions =
      this.helperDiscordService.generatePermissionBitField(userPermissions);

    const permissionsForBot = channel.permissionsFor(me);
    const permissionsForAuthor = channel.permissionsFor(authorFetched);

    if (!permissionsForBot.has(botPermissions, true)) {
      return {
        status: false,
        message: 'Bot has no permissions to run this command.',
      };
    }

    if (!permissionsForAuthor.has(authorPermissions, true)) {
      return {
        status: false,
        message: 'Author has no permissions to run this command.',
      };
    }

    return {
      status: true,
      message: '',
    };
  }
}

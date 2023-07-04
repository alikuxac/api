import { Injectable } from '@nestjs/common';

import {
  ChannelType,
  type Message,
  PermissionFlagsBits,
  PermissionsBitField,
} from 'discord.js';

@Injectable()
export class HelperDiscordService {
  private readonly requiredTextChannelPermissions = new PermissionsBitField([
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.SendMessagesInThreads,
  ]);

  private readonly requiredVoiceChannelPermissions = new PermissionsBitField([
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.SendMessages,
  ]);

  private readonly administratorPermissions = new PermissionsBitField([
    PermissionFlagsBits.Administrator,
  ]);

  /**
   * Checks if the given message can be executed in a text channel.
   *
   * @param {Message} message - The message object.
   * @return {Promise<boolean>} Returns true if the message can be executed in a text channel, otherwise false.
   */
  async canRunInTextChannel(message: Message) {
    const { channel } = message;
    if (channel.type === ChannelType.DM) return true;

    const me = await message.guild?.members.fetchMe();
    if (!me) return false;

    const permissionsFor = channel.permissionsFor(me);
    if (!permissionsFor) return false;

    return permissionsFor.has(this.requiredTextChannelPermissions, true);
  }

  /**
   * Checks if the given message can be executed in a voice channel.
   *
   * @param {Message} message - The message to check.
   * @return {Promise<boolean>} A boolean indicating whether the message can be executed in a voice channel.
   */
  async canRunInVoiceChannel(message: Message) {
    const { channel } = message;
    if (channel.type !== ChannelType.GuildVoice) return false;

    const me = await message.guild?.members.fetchMe();
    if (!me) return false;

    const permissionsFor = channel.permissionsFor(me);
    if (!permissionsFor) return false;

    return permissionsFor.has(this.requiredVoiceChannelPermissions, true);
  }

  /**
   * Generates a permission bit field from a given array of permissions.
   *
   * @param {bigint[]} permissions - An array of permissions.
   * @return {PermissionsBitField} The generated permission bit field.
   */
  generatePermissionBitField(permissions: bigint[]) {
    return new PermissionsBitField(permissions);
  }

  /**
   * Returns the prefix of the given content that matches any of the specified prefixes,
   * or null if none match.
   *
   * @param {string} content - The content to check for prefixes.
   * @param {string[]|string|null} prefixes - The prefixes to match against the content.
   *                                           Can be null, a string, or an array of strings.
   * @return {string|null} - The prefix that matches the content, or null if none match.
   */
  getPrefix(
    content: string,
    prefixes: readonly string[] | string | null,
  ): string | null {
    if (prefixes === null) return null;

    if (typeof prefixes === 'string') {
      return content.startsWith(prefixes) ? prefixes : null;
    }

    return prefixes.find((prefix) => content.startsWith(prefix)) ?? null;
  }

  /**
   * Retrieves the command prefix from the given content.
   *
   * @param {string} content - The content to search for the prefix.
   * @param {string | RegExp} prefix - The prefix to retrieve. Can be either a string or a regular expression.
   * @return {string} The command prefix.
   */
  getCommandPrefix(content: string, prefix: string | RegExp): string {
    return typeof prefix === 'string' ? prefix : prefix.exec(content)[0];
  }
}

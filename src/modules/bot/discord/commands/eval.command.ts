import { Injectable } from '@nestjs/common';
import {
  Command,
  InjectDiscordClient,
  Handler,
  IA,
} from '@discord-nestjs/core';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Client,
  EmbedBuilder,
  ChatInputCommandInteraction,
  MessagePayload,
} from 'discord.js';
import util from 'util';

import { DiscordEval } from 'src/modules/bot/discord/entities';
import { EvalDto } from 'src/modules/bot/discord/dto/eval.dto';

@Command({
  name: 'eval',
  description: 'Evaluates the code provide',
  descriptionLocalizations: { vi: 'Thực thi code' },
})
@Injectable()
export class EvalCommand {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    @InjectModel(DiscordEval.name, 'api')
    private readonly discordEvalModel: Model<DiscordEval>,
  ) {}

  private clean(text: any, client: Client) {
    if (typeof text !== 'string')
      text = util.inspect(text, {
        depth: 0,
      });
    const rege = new RegExp(<string>client.token, 'gi');
    const rege2 = new RegExp('6 + 9', 'gi');
    text = text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203))
      .replace(
        rege,
        '(node:800) UnhandledPromiseRejectionWarning: Error: Incorrect login details were provided.',
      )
      .replace(rege2, '69');
    return text;
  }

  @Handler()
  async onEval(
    @IA() interaction: ChatInputCommandInteraction,
    @IA(SlashCommandPipe) dto: EvalDto,
  ) {
    const { code } = dto;
    try {
      let result = await eval(code);
      if (typeof result !== 'string') {
        result = util.inspect(result, { depth: 0 });
      }
      if (result.length < 4000) {
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Eval by ${interaction.user.tag}`,
            iconURL: `https://cdn.discordapp.com/emojis/314405560701419520.png`,
          })
          .setDescription(`**:inbox_tray: Input:**\n\n\`\`\`js\n${code}\`\`\``)
          .addFields([
            {
              name: `\u200b`,
              value: `**:outbox_tray: Output:**\n\n\`\`\`js\n${this.clean(
                result,
                this.client,
              )}\`\`\``,
              inline: true,
            },
          ])
          .setColor(0x00ff00)
          .setFooter({
            text: `Node.js - Time taken: ${
              Date.now() - interaction.createdTimestamp
            } ms`,
          });
        return new MessagePayload(interaction.channel, { embeds: [embed] });
      } else {
        const newEval = new this.discordEvalModel({
          botId: this.client.user.id,
          userId: interaction.user.id,
          code: code,
          result: result,
        });
        await newEval.save();
        return new MessagePayload(interaction.channel, {
          content:
            'Because result is too long, please check result  by using API',
        });
      }
    } catch (error) {
      return new MessagePayload(interaction.channel, {
        content: 'Error while evaluating code',
      });
    }
  }
}

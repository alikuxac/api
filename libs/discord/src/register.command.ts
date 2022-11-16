import { SlashCommandBuildewr } from 'discord.js';

// Slash Command
const alikuxacCommand = new SlashCommandBuilder()
  .setName('alikuxac')
  .setDescription('Alikuxac command')
  // stick role
  .addSubcommandGroup((group) => {
    return group
      .setName('stickRole')
      .setDescription('Stick role for user')
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('addStickRole')
          .setDescription('Add Stick role for user')
          .addUserOption((opt) => {
            return opt
              .setName('user-stick-role')
              .setDescription('User')
              .setRequired(true);
          })
          .addRoleOption((opt) => {
            return opt.setName('role').setDescription('Role').setRequired(true);
          });
      })
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('removeStickRole')
          .setDescription('Remove Stick role for user')
          .addUserOption((opt) => {
            return opt
              .setName('user-stick-role')
              .setDescription('User')
              .setRequired(true);
          });
      })
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('listStickRole')
          .setDescription('List Stick role for user')
          .addUserOption((opt) => {
            return opt
              .setName('user-stick-role')
              .setDescription('User')
              .setRequired(true);
          });
      });
  })
  // Redirect group
  .addSubcommandGroup((group) => {
    return group
      .setName('redirect')
      .setDescription('Redirect command')
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('add-redirect')
          .setDescription('Add redirect')
          .addStringOption((opt) => {
            return opt
              .setName('redirect-path-add')
              .setDescription('Redirect path to add')
              .setRequired(true);
          })
          .addStringOption((opt) => {
            return opt
              .setName('redirect-url-add')
              .setDescription('Redirect url to add')
              .setRequired(true);
          });
      })
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('remove-redirect')
          .setDescription('Remove redirect')
          .addStringOption((opt) => {
            return opt
              .setName('redirect')
              .setDescription('Redirect')
              .setRequired(true);
          });
      })
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('list-redirect')
          .setDescription('List redirect')
          .addIntegerOption((opt) => {
            return opt
              .setName('redirect-page')
              .setDescription('Redirect page')
              .setMinValue(1);
          })
          .addIntegerOption((opt) => {
            return opt
              .setName('redirect-limit')
              .setDescription('Redirect limit')
              .setMinValue(1);
          })
          .addBooleanOption((opt) => {
            return opt.setName('redirect-all').setDescription('Redirect all');
          });
      });
  })
  // Reminder group
  .addSubcommandGroup((group) => {
    return group
      .setName('reminder')
      .setDescription('Reminder command')
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('add-reminder')
          .setDescription('Add reminder')
          .addStringOption((opt) => {
            return opt
              .setName('reminder-title')
              .setDescription('Reminder title')
              .setRequired(true);
          })
          .addStringOption((opt) => {
            return opt
              .setName('reminder-description')
              .setDescription('Reminder description')
              .setRequired(true);
          })
          .addStringOption((opt) => {
            return opt
              .setName('reminder-time')
              .setDescription('Reminder time')
              .setRequired(true);
          });
      })
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('remove-reminder')
          .setDescription('Remove reminder')
          .addStringOption((opt) => {
            return opt
              .setName('reminder')
              .setDescription('Reminder')
              .setRequired(true);
          });
      })
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('list-reminder')
          .setDescription('List reminder')
          .addIntegerOption((opt) => {
            return opt
              .setName('reminder-page')
              .setDescription('Reminder page')
              .setMinValue(1);
          })
          .addIntegerOption((opt) => {
            return opt
              .setName('reminder-limit')
              .setDescription('Reminder limit')
              .setMinValue(1);
          })
          .addBooleanOption((opt) => {
            return opt.setName('reminder-all').setDescription('Reminder all');
          });
      });
  });

const imageCommand = new SlashCommandBuilder()
  .setName('image')
  .setDescription('Image command')
  .addSubcommandGroup((group) => {
    return group
      .setName('setting')
      .setDescription('Image setting command')
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('add')
          .setDescription('Add image setting')
          .addStringOption((opt) => {
            return opt
              .setName('image-setting-name')
              .setDescription('Image setting name')
              .setRequired(true);
          })
          .addStringOption((opt) => {
            return opt
              .setName('image-setting-value')
              .setDescription('Image setting value')
              .setRequired(true);
          });
      });
  })
  .addSubcommandGroup((group) => {
    return group
      .setName('image-category')
      .setDescription('Image category command')
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('add')
          .setDescription('Add image category')
          .addStringOption((opt) => {
            return opt
              .setName('image-category-name')
              .setDescription('Image category name')
              .setRequired(true);
          });
      })
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('remove')
          .setDescription('Remove image category')
          .addStringOption((opt) => {
            return opt
              .setName('image-category')
              .setDescription('Image category')
              .setRequired(true);
          });
      });
  });

const currencyCommand = new SlashCommandBuilder()
  .setName('currency')
  .setDescription('Currency command')
  .addSubcommandGroup((group) => {
    return group
      .setName('owner')
      .setDescription('Currency owner command')
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('add')
          .setDescription('Add currency')
          .addStringOption((opt) => {
            return opt
              .setName('currency-name')
              .setDescription('Currency name')
              .setRequired(true);
          })
          .addStringOption((opt) => {
            return opt
              .setName('currency-symbol')
              .setDescription('Currency symbol')
              .setRequired(true);
          });
      })
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('remove')
          .setDescription('Remove currency')
          .addStringOption((opt) => {
            return opt
              .setName('currency')
              .setDescription('Currency')
              .setRequired(true);
          });
      })
      .addSubcommand((subcmd) => {
        return subcmd
          .setName('reset')
          .setDescription('Reset currency')
          .addUserOption((opt) => {
            return opt.setName('user').setDescription('User').setRequired(true);
          });
      });
  });

export const cmdArray = [alikuxacCommand, imageCommand, currencyCommand];

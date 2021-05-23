require("dotenv").config();

const telegram = async () => {
  const { Telegraf } = require("telegraf");

  const keyboard = require("./keyboard/keyboardTelegram").keyboard;

  const { telegramClient } = require("../../database/index").models.roles;
  const { idOwner } = require("../../database/index").models.roles;
  const { checkRoleTelegram } = require("../../database/index").methods;
  const { checkRoleClient } = require("../../database/index").methods;

  const TgBot = new Telegraf(process.env.TELEGRAM_CLIENT_BOT_TOKEN);

  TgBot.start(async (ctx) => {
    const clientAdd = await checkRoleTelegram("telegram", ctx, telegramClient);
    clientAdd.state.subscription = "added";
    await clientAdd.save();

    await ctx.reply(
      "Hi, this is the TEST BIB-bot\n" +
        "before you start using the bot, log in\n" +
        "please enter and send bot your mail"
    );
  });

  TgBot.on("message", async (ctx) => {
    const clientAdd = await telegramClient.findOne({ idTelegram: ctx.from.id });

    const clientStatus = clientAdd.state.subscription;
    const msg = ctx.message.text;

    switch (clientStatus) {
      case "added":
        const mailOk = await idOwner.findOne({ mail: msg });
        if (!!mailOk) {
          ctx.reply(
            "email confirmed!\n" + "now enter and send bot your password"
          );
          clientAdd.state.subscription = "mailOk";
          await clientAdd.save();
        } else {
          ctx.reply(
            "sorry(( mail not correct, try again or subscribe if not subscribed!"
          );
        }

        break;

      case "mailOk":
        const passOk = await idOwner.findOne({ password: msg });
        if (!!passOk) {
          ctx.reply("password confirmed!\n" + 'please click > "subscribe"');
          clientAdd.state.subscription = "PassOk";
          await clientAdd.save();
            await idOwner.findOneAndUpdate(
              { password: msg },
              { $push: { telegram: [clientAdd._id] } }
            );
        } else {
          ctx.reply("sorry(( password not correct, try again!");
        }

        break;
    }
  });

  await TgBot.launch();

  return TgBot;
};

module.exports = {
  telegramClientBot: telegram,
};

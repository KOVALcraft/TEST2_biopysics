require("dotenv").config();

const telegram = async () => {
  const { Telegraf } = require("telegraf");


  const clientOwner = require('../../database/models/roles/Clients')
  const telegramClient = require('../../database/models/roles/msgClientTg')
  const connectedSrv = require('../../database/models/dataElements/connectedSrv')
  const Login = require('../../database/models/dataElements/login')
  const { checkRoleTelegram } = require("../../database/index").methods;

  const TgBot = new Telegraf(process.env.TELEGRAM_CLIENT_BOT_TOKEN);

  TgBot.start(async (ctx) => {
    const clientAdd = await checkRoleTelegram("telegram", ctx, telegramClient);
    clientAdd.state.subscription = "added";
    await clientAdd.save();

    await ctx.reply(
      "Hi, this is the TEST BIB-bot\n" +
        "before you start using the bot, login 🔒\n" +
        "\n" +
        "First step❗️\n" +
        "📩 please send bot your mail... 📩"
    );
    await ctx.replyWithMediaGroup([
      {
        media: { source: "./media/log.gif" },
        type: "video",
      },
    ]);
  });

  TgBot.on("message", async (ctx) => {
    const clientAdd = await telegramClient.findOne({ idTelegram: ctx.from.id });

    const clientStatus = clientAdd.state.subscription;
    const msg = ctx.message.text;

    switch (clientStatus) {
      case "added":
        const mailOk = await Login.findOne({ login: msg });
        if (!!mailOk) {
          ctx.reply(
            "email 📩 confirmed!\n" +
              "Next step❗️\n" +
              "now please send bot your password 🔐"
          );
          clientAdd.state.subscription = "mailOk";
          await clientAdd.save();
        } else {
          ctx.reply(
            "sorry 😞 mail is not correct, try again or subscribe if not subscribed!"
          );
        }

        break;

      case "mailOk":
        const passOk = await Login.findOne({ password: msg });
        if (!!passOk) {
          ctx.reply(
            "password confirmed!\n" +
              "You entered your account 🔓\n" +
              "now you can receive notifications 📲"
          );
          clientAdd.state.subscription = "PassOk";
          await clientAdd.save();
          const Owner = await clientOwner.findOne({ _id: passOk.clientId });
          await connectedSrv.findOneAndUpdate(
            { clientId: Owner._id },
            { $push: { telegram: [clientAdd._id] } }
          );
          const Srv = await connectedSrv.findOne({ clientId: Owner._id });
          await telegramClient.findOneAndUpdate(
              { _id: clientAdd._id },
              { $set: { connectedSrv: Srv._id } }
          );
        } else {
          ctx.reply("sorry 😞 password not correct, try again!");
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

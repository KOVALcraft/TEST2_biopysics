require("dotenv").config();

const clientOwner = require("../../database/models/roles/Clients");
const ClientVb = require("../../database/models/roles/msgClient");
const connectedSrv = require("../../database/models/dataElements/connectedSrv");
const Login = require("../../database/models/dataElements/login");
const { checkRoleViber } = require("../../database/index").methods;

const { subKeyboard } = require("./keyboards/viberKeyboards");
const keyboard = subKeyboard();

const ViberBot = require("viber-bot").Bot,
  BotEvents = require("viber-bot").Events,
  TextMessage = require("viber-bot").Message.Text;
// VideoMessage = require("viber-bot").Message.Video;

const bot = new ViberBot({
  authToken: process.env.VIBER_CLIENT_BOT_TOKEN,
  name: "BIB Bot",
  avatar:
    "https://compote.slate.com/images/fb3403a0-6ffc-471a-8568-b0f01fa3bd6b.jpg",
});

bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) =>
  onFinish(
    new TextMessage(
      // `https://cdn.dribbble.com/users/29906/screenshots/1230849/animated-login.gif`,
      `TEST BIB bot, please signed`,
      keyboard
    )
  )
);

bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
  try {
    const client = await checkRoleViber(
      "viber",
      response.userProfile,
      ClientVb
    );
    // client.state.subscription = "added";
    // await client.save();

    const clientStatus = client.state.subscription;
    const msg = message.text;

    // if (!!client) {
      switch (clientStatus) {
        case "null":
          await response.send(
            new TextMessage(
                "before you start using the bot, login 🔒\n" +
                "\n" +
                "First step❗️\n" +
                "📩 please send bot your mail... 📩"
            )
          );
          client.state.subscription = "added";
          await client.save();
          break;
      // }
    // } else {
    //   await response.send(
    //     new TextMessage(
    //       "sorry 😞 something went wrong!\n" +
    //         "P.S. the client is not in the database"
    //     )
    //   );
    // }
    //"sorry 😞 mail is not correct, try again or subscribe if not subscribed!"


    // switch (clientStatus) {
      case "added":
        const mailOk = await Login.findOne({ login: msg });
        if (!!mailOk) {
          await response.send(
            new TextMessage(
              "email 📩 confirmed!\n" +
                "Next step❗️\n" +
                "now please send bot your password 🔐"
            )
          );
          client.state.subscription = "mailOk";
          await client.save();
        } else {
          await response.send(
            new TextMessage(
              "sorry 😞 mail is not correct, try again or subscribe if not subscribed!"
            )
          );
        }
        break;

      case "mailOk":
        const passOk = await Login.findOne({ password: msg });
        if (!!passOk) {
          await response.send(
            new TextMessage(
              "password confirmed!\n" +
                "You entered your account 🔓\n" +
                "now you can receive notifications 📲"
            )
          );
          client.state.subscription = "PassOk";
          await client.save();
          const Owner = await clientOwner.findOne({ _id: passOk.clientId });
          await connectedSrv.findOneAndUpdate(
            { clientId: Owner._id },
            { $push: { viber: [client._id] } }
          );
          const Srv = await connectedSrv.findOne({ clientId: Owner._id });
          await ClientVb.findOneAndUpdate(
            { _id: client._id },
            { $set: { connectedSrv: Srv._id } }
          );
        } else {
          await response.send(
            new TextMessage("sorry 😞 password not correct, try again!")
          );
        }

        break;
    }
  } catch (e) {
    console.log(e);
  }
});
module.exports = { viberClientBot: bot };

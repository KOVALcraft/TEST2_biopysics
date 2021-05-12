require('dotenv').config();
const {Client} = require('../../database/index').models.roles;
const {checkRoleViber} = require('../../database/index').methods

const {subKeyboard} = require('./keyboards/viberKeyboards')
const keyboard = subKeyboard();

const
    ViberBot = require('viber-bot').Bot,
    BotEvents = require('viber-bot').Events,
    TextMessage = require('viber-bot').Message.Text

const bot = new ViberBot({
    authToken : process.env.VIBER_CLIENT_BOT_TOKEN,
    name: "BIB Bot",
    avatar: "https://compote.slate.com/images/fb3403a0-6ffc-471a-8568-b0f01fa3bd6b.jpg"
})


bot.onConversationStarted((userProfile, isSubscribed, context, onFinish) =>
    onFinish(new TextMessage(`TEST BIB bot, please signed`, keyboard)));

bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response)=>{
    const client = await checkRoleViber('viber', response.userProfile, Client);
    try{
            switch (message.text) {
                case "signed":
                    client.state.subscription = 'signed';
                    await client.save();
                    break;
            }
    }catch(e)
    {
        console.log(e)
    }
})
module.exports = {viberClientBot:bot};

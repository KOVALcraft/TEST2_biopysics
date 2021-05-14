require('dotenv').config()

const telegram = async ()=>{

const {Telegraf} = require('telegraf')

const keyboard = require('./keyboard/keyboardTelegram').keyboard

const {telegramClient} = require('../../database/index').models.roles
const {checkRoleTelegram} = require('../../database/index').methods

const TgBot = new Telegraf(process.env.TELEGRAM_CLIENT_BOT_TOKEN)

TgBot.start(async ctx=> {
    await ctx.reply('TEST BIB bot', {
            reply_markup: {
                keyboard: keyboard
            }
        })
})

    TgBot.on('message', async ctx=>{
    const client = await checkRoleTelegram('telegram', ctx, telegramClient);
    switch (ctx.message) {
        case 'subscribe':
            client.state.subscription = 'signed';
            await client.save();
            break;
    }
})

    await TgBot.launch()

    return TgBot
// const start = async ()=>{
// await TgBot.launch()
// }
// start()
}

module.exports = {
    telegramClientBot:telegram
};

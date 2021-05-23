require('dotenv').config();
const ImageData = require('../database/models/imageData')
const Client = require('../database/models/roles/msgClient')
const telegramClient = require('../database/models/roles/msgClientTg')
const idOwner = require('../database/models/roles/Clients')

//----------подключение к облачной монге------------------
const mongoose = require('mongoose')
const connect = async ()=>{
    try{
        await mongoose.connect('mongodb+srv://koval:151020qwer@cluster0.wd7w2.mongodb.net/Biophysics_project',{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log('mongo connected')
    }
    catch (e) {
        console.log(e.message)
    }
}

//-------------сохранение данных в базу---------------------
const createData = async (msg)=> {
    try {
        await ImageData.create(
            {
                name: JSON.stringify(msg.name),
                comment:JSON.stringify(msg.comment)
            }
            )
        console.log('data creation completed')
    } catch (e) {
        console.log(e)
    }
}

//-------------выборка данных из базы---------------------
const readData = async (msg)=> {
    try {
       let imageDataObject = await ImageData.find({name:JSON.stringify(msg.name)})
        // console.log('read data completed ', imageDataObject)
        return imageDataObject
    } catch (e) {
        console.log(e)
    }
}


//------------делаем проверку в базе на предмет подписчиков Viber на рассылку------------------
const checkRoleViber = async (source, profile, Role) => {

    let role = {}
    if(source === 'viber'){
        role = await Role.findOne({idViber:profile.id})
        if(!role){
            await Role.create({
                source:'viber',
                idViber:profile.id,
                profileViber: {
                    id: profile.id,
                    name: profile.name,
                    avatar: profile.avatar,
                    country: profile.country,
                    language: profile.language,
                    apiVersion: profile.apiVersion,
                },
                state:{
                    subscription:'null'
                    }
            })
            role = await Role.findOne({idViber:profile.id})
        }
    }
    console.log('save new client completed: ', role)
    return role
}

//------------делаем проверку в базе на предмет подписчиков Telegram на рассылку------------------
const checkRoleTelegram = async (source, ctx, Role) => {

    let role = {}
    if(source === 'telegram'){
        role = await Role.findOne({idTelegram:ctx.from.id})
        if(!role){
            await Role.create({
                source:'telegram',
                idTelegram: ctx.from.id,
                profileTelegram: {
                    id: ctx.from.id,
                    name: ctx.from.first_name,
                    username: ctx.from.username,
                    language: ctx.from.language_code,
                    is_bot: ctx.from.is_bot
                    },
                state:{
                    subscription:'added'
                }
            })
            role = await Role.findOne({idTelegram:ctx.from.id})
        }
    }
    // console.log('save new client completed: ', role)
    return role
}

//------------делаем проверку в базе на предмет наличия клиента в базе------------------
const checkRoleClient = async (log, Role) => {

    let role = {}
        role = await Role.findOne({mail:log})
        if(!role){
            await Role.create({
                mail: log.mail,
                password: log.password,
                messengers:{
                    viber: 'null',
                    telegram: 'null',
                },
                state: 'default'
            })
            role = await Role.findOne({mail:log})
        }
    console.log('save new client completed: ', role)
    return role
}

module.exports = {
    connect,
    createData,
    readData,
    methods:{
        checkRoleViber,
        checkRoleTelegram,
        checkRoleClient
    },
    models:{
        roles:{
            Client,
            telegramClient,
            idOwner
        }
    }
}
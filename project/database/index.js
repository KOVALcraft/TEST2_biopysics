require('dotenv').config();
const ImageData = require('../database/models/imageData')
const Client = require('../database/models/roles/msgClient')

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


//------------делаем проверку в базе на предмет подписчиков на рассылку------------------
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


module.exports = {
    connect,
    createData,
    readData,
    methods:{
        checkRoleViber
    },
    models:{
        roles:{
            Client
        }
    }
}
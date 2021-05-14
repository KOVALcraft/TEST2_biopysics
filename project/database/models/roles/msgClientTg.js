const {model, Schema} = require('mongoose')

const schema = new Schema({
    source: {type:String},
    idTelegram:{type:String,unique: true},
    profileTelegram: {
        id:{type:String},
        name:{type:String},
        username:{type:String},
        language:{type:String},
        is_bot:{type:String}
        },
    state:{
        subscription:{type:String}
    },
    dateOfSigned:{type:Date, default:Date.now}
})

module.exports = model('telegramClient', schema)
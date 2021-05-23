const {model, Schema, Types} = require('mongoose')

const schema = new Schema({
    owner:{type:Types.ObjectId, ref:'idOwner'},
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
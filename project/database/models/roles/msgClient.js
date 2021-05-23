const {model, Schema, Types} = require('mongoose')

const schema = new Schema({
    owner:{type:Types.ObjectId, ref:'idOwner'},
    source: {type:String},
    idViber:{type:String,unique: true},
    profileViber: {
        id:{type:String},
        name:{type:String},
        avatar:{type:String},
        country:{type:String},
        language:{type:String},
        apiVersion:{type:String}
    },
    state:{
        subscription:{type:String}
        },
    dateOfSigned:{type:Date, default:Date.now}
})

module.exports = model('Client', schema)
const {model, Schema} = require('mongoose')

const schema = new Schema({
    name:{type:String, required:true},
    comment:{type:String, required:true},
    date:{type:Date, default:Date.now}
})


module.exports = model('ImageData', schema)
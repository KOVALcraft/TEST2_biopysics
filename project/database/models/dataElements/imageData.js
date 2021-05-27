const { model, Schema, Types } = require("mongoose");

const schema = new Schema({
    clientId: {type: Types.ObjectId, ref:'clientId'},
    name: { type: String, required: true },
    comment: { type: String },
    date: { type: Date, default: Date.now },
});

module.exports = model("ImageData", schema);
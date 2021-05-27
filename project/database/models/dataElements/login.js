const { model, Schema, Types } = require("mongoose");
const schema = new Schema({
    clientId: { type: Types.ObjectId, ref: "clientId" },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
});

module.exports = model("login", schema);
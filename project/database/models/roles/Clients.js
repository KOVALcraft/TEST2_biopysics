const { model, Schema, Types } = require("mongoose");
const schema = new Schema({
  dateOfSigned: { type: Date, default: Date.now },
  login: { type: Types.ObjectId, ref: "login" },
  connectedSrv: { type: Types.ObjectId, ref: "connectedSrv" },
  imageData: { type: Types.ObjectId, ref: "imageData" },
});

module.exports = model("clientOwner", schema);
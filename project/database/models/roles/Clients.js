const { model, Schema, Types } = require("mongoose");
const schema = new Schema({
  mail: { type: String },
  password: { type: String },
  viber: [{ type: Types.ObjectId, ref: "Client" }],
  telegram: [{ type: Types.ObjectId, ref: "telegramClient" }],
  state: {
    subscription: {
      type: String,
    },
  },
  dateOfSigned: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("idOwner", schema);
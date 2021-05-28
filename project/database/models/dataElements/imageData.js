const fields = require("../../databasefields");
const { model, Schema, Types } = require("mongoose");

const schema = new Schema({
  clientId: { type: Types.ObjectId, ref: fields.modelRoleClient },
  name: { type: String, default: "no name" },
  comment: { type: String, default: "no comment" },
  date: { type: Date, default: Date.now },
});

module.exports = model(fields.modelDataImage, schema);
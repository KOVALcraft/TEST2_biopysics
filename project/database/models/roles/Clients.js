const fields = require('../../databasefields')
const { model, Schema, Types } = require("mongoose");
const schema = new Schema({
  dateOfSigned: { type: Date, default: Date.now },
  login: { type: Types.ObjectId, ref: fields.modelDataLogin},
  connectedSrv: { type: Types.ObjectId, ref: fields.modelServicesClientServices },
  imageData: { type: Types.ObjectId, ref: fields.modelDataImage },
});

module.exports = model(fields.modelRoleClient, schema);
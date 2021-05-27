const { model, Schema, Types } = require("mongoose");
const schema = new Schema({
    clientId: { type: Types.ObjectId, ref: "clientId" },
    telegram: [{ type: Types.ObjectId, ref: "telegram" }],
    viber: [{ type: Types.ObjectId, ref: "viber" }],
});

module.exports = model("connectedSrv", schema);
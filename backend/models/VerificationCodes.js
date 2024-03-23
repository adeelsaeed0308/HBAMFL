const { Schema, model, Types: { ObjectId } } = require("mongoose");
const User = require("./User");

const Codes = new Schema({
    user_id : {
        type: ObjectId,
        ref: User,
        required: true
    },
    code: {
        type: String,
        required: true,
        match:/^[0-9]{6,6}$/g
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model("VerificationCodes", Codes);
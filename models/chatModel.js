const mongoose = require("mongoose")
const Schema=mongoose.Schema;
const user=require("./user");
const group=require("./group");

const chatSchema = new Schema
({
    groupid: {
        type: Schema.Types.ObjectId,
        ref: 'group'
    },
    messages: [{
        type: Schema.Types.Object,
        ref: 'user',
        text: String,
        time : {
            type : Date, 
            default: Date.now 
        },
        profile_pic: String
    }]
})

const chat = mongoose.model("chat", chatSchema);
module.exports = chat;
const mongoose = require("mongoose")
const Schema=mongoose.Schema;
const user=require("./user");
const group=require("./group");

const forumSchema = new Schema
({
    groupid: {
        type: Schema.Types.ObjectId,
        ref: 'group'
    },
    questions: [{
        type: Schema.Types.Object,
        ref: 'user',
        ques: String,
        time : {
            type : Date, 
            default: Date.now 
        },
        answers:[{
            type: Schema.Types.Object,
            ref: 'user',
            ans: String,
            votes: Number,
            time : {
            type : Date, 
            default: Date.now 
        }
        }]
    }]
})

const forum = mongoose.model("forum", forumSchema);
module.exports = forum;
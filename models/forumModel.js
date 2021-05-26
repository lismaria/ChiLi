const mongoose = require("mongoose")
const Schema=mongoose.Schema;
const user=require("./user");
const group=require("./group");

const answerSchema = new Schema
({
    user_name: {
        type: Schema.Types.Object,
        ref: 'user'
    },
    ans: String,
    time : {
        type : Date, 
        default: Date.now 
    },
    votes: Number,
    profile_pic: String
})

const questionSchema = new Schema
({
    user_name: {
        type: Schema.Types.Object,
        ref: 'user'
    },
    ques_title: String,
    ques_descr: String,
    time : {
        type : Date, 
        default: Date.now 
    },
    profile_pic: String,
    answers:[answerSchema]
})

const forumSchema = new Schema
({
    groupid: {
        type: Schema.Types.ObjectId,
        ref: 'group'
    },
    questions: [questionSchema]
})

const forum = mongoose.model("forum", forumSchema);
module.exports = forum;
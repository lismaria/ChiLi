const mongoose = require("mongoose")
const Schema=mongoose.Schema;
const user=require("./user");
const group=require("./group");

const newsSchema = new Schema
({
    groupid: {
        type: Schema.Types.ObjectId,
        ref: 'group'
    },
    newscontent: [{
        type: Schema.Types.Object,
        ref: 'user',
        news_title: String,
        news_story: String,
        time : {
            type : Date, 
            default: Date.now 
        }
    }]
})

const news = mongoose.model("news", newsSchema);
module.exports = news;
const mongoose = require("mongoose")
const Schema=mongoose.Schema;
const user=require("./user");
// const userSchema = require("./user/userSchema");

//Creating the schema 
const groupSchema = new Schema
({
        group_name:String,
        admin_name:String,
        group_descr:String,
        group_code:String,
        users:[{
                type:Schema.Types.Object,
                ref:'user'
        }],
        chat_id:{
                type:Schema.Types.ObjectId,
                ref:'chat'
        },
        news_id:{
                type:Schema.Types.ObjectId,
                ref:'news'
        }
});


//Creating the model
const group=mongoose.model("group",groupSchema);      //(collection_name,scheme_name)

module.exports=group;                                   //exporting the model to be used in other files
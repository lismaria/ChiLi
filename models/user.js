const mongoose = require("mongoose")
const group=require("./group");
const Schema=mongoose.Schema;

//Creating the schema 
const userSchema = new Schema
({
        user_name:String,
        full_name:String,
        user_email:String,
        user_pswd:String,
        groups:[{
                type:Schema.Types.Object,
                ref:'group'
        }],
        profile_pic:String
});


//Creating the model
const user=mongoose.model("user",userSchema);      //(collection_name,scheme_name) 

module.exports=user;                                //exporting the model to be used in other files
const mongoose = require("mongoose")
const Schema=mongoose.Schema;
const user = require("./user")

//Creating the schema 
const groupSchema = new Schema
({
        group_name:String,
        admin_name:String,
        group_descr:String,
        group_code:String,
        users:[user.userSchema]
});


//Creating the model
const group=mongoose.model("group",groupSchema);      //(collection_name,scheme_name)

module.exports=group;                                   //exporting the model to be used in other files
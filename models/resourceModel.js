const mongoose = require("mongoose")
const Schema=mongoose.Schema;
const user=require("./user");
const group=require("./group");

const fileSchema = new Schema
({
    name:String,
    mimetype:String,
    rename:String
})

const folderschema = new Schema
({
    folder_name: String,
    files:[fileSchema]
})

const resourceSchema = new Schema
({
    groupid: {
        type: Schema.Types.ObjectId,
        ref: 'group'
    },
    folders: [folderschema]
})

const resource = mongoose.model("resource", resourceSchema);
module.exports = resource;
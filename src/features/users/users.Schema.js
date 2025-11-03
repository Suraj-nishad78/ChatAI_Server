import mongoose from "mongoose";

const UsersSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    imageURL:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
})

const UsersModel = mongoose.model("Users", UsersSchema);

export default UsersModel;
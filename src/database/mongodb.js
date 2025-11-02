import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongodbServer = process.env.MONGDB_SERVER;

export const connectDb = async() =>{
    try{
        await mongoose.connect(mongodbServer);
        console.log('Database connected ✅');
    }catch(e){
        console.log("Error while connecting to DB: ", err);
    }
}
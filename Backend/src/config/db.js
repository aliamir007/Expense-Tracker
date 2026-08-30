import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const database=async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`mongoDb connected...port number: ${mongoose.connection.host}`)
    }catch(error){
        console.log(process.env.MONGODB_URI);
        console.log('error',error);
        throw error;
        process.exit(1);
    }
};

export default database;
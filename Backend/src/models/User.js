import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    budget:{
        type:Number,
        default:0,
        min:0,
    },
    currency:{
        type:String,
        default:'PKR',
    }
    },
    {
        timestamps:true
    })

const User=mongoose.model("User",userSchema);

export default User;
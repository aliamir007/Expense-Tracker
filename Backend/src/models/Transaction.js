import mongoose from 'mongoose'

const transactionSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
        min:0,
    },
    type:{
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    category:{
        type:String,
        required:true
    },
    priority:{
        type:String,
        enum:["high","medium","low"],
        default:"medium"
    },
    quantity:{
        type:Number,
        default:1,
        min:1
    },
    description:{
        type:String,
        required:false,
        default:'',
    },
    date:{
        type:Date,
        required:true
    }
},{timestamps:true})

const Transaction=mongoose.model('Transaction',transactionSchema)

export default Transaction
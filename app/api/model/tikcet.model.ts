import mongoose,{ Schema, Model, Document } from "mongoose";

interface tikcetModel extends Document{
    name:string,
    email:string,
    contact:number,
    eventName:string,
    ticketCount:number
    org:string
    token:string,
    isUsed :boolean
}

const tikcetSchema :Schema<tikcetModel> = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true
    },
    eventName:{
        type:String,
        required:true
    },
    ticketCount:{
        type:Number,
        required:true
    },
     org:{
        type:String,
        required:true
    },
    token:{
        type:String,
    },
    isUsed:{
        type:Boolean,
        default:false
    },
    
},{timestamps:true})


const ticket: Model<tikcetModel> = mongoose.models.ticket || mongoose.model<tikcetModel>("ticket", tikcetSchema)

export default ticket

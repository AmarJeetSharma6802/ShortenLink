import mongoose from "mongoose";

const FormSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        index: true,
        lowercase: true,
    },   
    email:{
        type:String,
        required: true,
        index: true,
        lowercase: true,
    } ,
    password: {
        type: String,
        required: [true, 'Password is required']
    }, 
    refreshToken: {
        type: String,
    },

}
,{
    timestamps:true
})

const userForm = mongoose.models.userForm || mongoose.model("userForm", FormSchema);

export default userForm
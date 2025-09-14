import mongoose from "mongoose";


const itemSchema = new mongoose.Schema({
    name:{
       type: String,
    },
    age:{
        type :Number,
    },
    image: [{ type: String }],

},{timestamps:true})

const item = mongoose.models.item || mongoose.model("item", itemSchema);


export default item
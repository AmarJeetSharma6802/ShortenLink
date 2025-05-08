import mongoose from "mongoose";


const itemSchema = new mongoose.Schema({
    name:{
       type: String,
        require:true
    },
    age:{
        type :Number,
        require:true
    },
    image:{
        type: String,
        require:true
    }

},{timestamps:true})

const item = mongoose.models.item || mongoose.model("item", itemSchema);


export default item
import userForm from "@/app/api/model/model.form.js";
import { NextResponse } from "next/server";
import DBconnect from "@/app/api/utils/db.connect"; 
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"


export async function POST(req){
    DBconnect()
    try {
        
        const {name,email,password,confirmPssword} = await req.json()

        if(!name || ! email || !password ||! confirmPssword){
            return NextResponse.json({ message: "Please fill in all fields." }, { status: 400 });
        }

        if(password !== confirmPssword){
            return NextResponse.json({Message :"password doest not Match"} , {status:400})
        }

        const findUser = await userForm.findOne({
            $or:[{name },{email}]
        })

        const salt = await bcrypt.genSalt(10); // ✅ salt will be a string
        const hashedPassword = await bcrypt.hash(password, salt);

        if(findUser){
            return NextResponse.json({ message: "User already exists" },{status:400})
        }

        const create = await userForm.create({
            name,
            email,
            password:hashedPassword,
            confirmPssword
        })

        const token = jwt.sign({_id:create._id,email:create.email},
            process.env.JWTSECRETKEY,
            {expiresIn:"1d"}
        )

        const user  = await userForm.findById(create._id).select("-password")
        
        return NextResponse.json({user,meassage:"user register succesfully",token},{status:200})

        
    } catch (error) {
        console.error("Error in user registration:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
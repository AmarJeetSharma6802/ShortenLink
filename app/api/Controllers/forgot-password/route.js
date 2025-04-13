import userForm from "@/app/api/model/model.form.js";
import { NextResponse } from "next/server";
import DBconnect from "@/app/api/utils/db.connect";
import jwt from "jsonwebtoken"


export async function POST(req){
    await DBconnect()

    try {
        const {email} = await req.json()
        const user = await userForm.findOne({email})

        if(!user){
            return new NextResponse("User not found", {status: 404})
        }
        const token = jwt.sign({user_id:user._id, email :user.email},process.env.JWTSECRETKEY,{expiresIn:"15m"})

        const resetLink = `http://localhost:3000/reset-password?token=${token}`;

        console.log(resetLink)
        return NextResponse.json({ message: "Reset link sent to your email", resetLink }, { status: 200 });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
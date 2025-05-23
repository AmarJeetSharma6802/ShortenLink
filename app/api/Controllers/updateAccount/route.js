import userForm from "@/app/api/model/model.form.js";
import { NextResponse } from "next/server";
import DBconnect from "@/app/api/utils/db.connect";
import { authUser } from "@/app/api/middleware/authUser.js";

export  async function PATCH(req) {
    await DBconnect();
    const { user, error } = await authUser(req);
    if (error) {
        return error;
    }
    try {
        const { name, email } = await req.json();

        if(!name  || !email){
            return NextResponse.json({ message: "Name and email are required" }, { status: 400 });
        }
        const User =  await userForm.findByIdAndUpdate(
            user?._id,
            {
                $set: {
                    name: name,
                    email: email,
                }
            },

            { new: true },

        ).select("-password -__v -createdAt -updatedAt");

        return NextResponse.json(User,{message :"account update succcefully"}, { status: 200 });


    } catch (error) {
        return NextResponse.json({ message: "Account update failed" }, { status: 500 });
    }
}
import userForm from "../../model/model.form.js";
import { NextResponse } from "next/server";
import DBconnect from "../../utils/db.connect"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
    await DBconnect();

    try {
        const { name, email, password, confirmPassword,role } = await req.json();

        if (!name || !email || !password || !confirmPassword) {
            return NextResponse.json({ message: "Please fill in all fields." }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
        }

        const findUser = await userForm.findOne({
            $or: [{ name }, { email }]
        });

        if (findUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const create = await userForm.create({
            name,
            email,
            password: hashedPassword,
            confirmPassword,
            role
        });

        const accessToken = jwt.sign(
            { _id: create._id, email: create.email },
            process.env.JWTSECRETKEY,
            { expiresIn: "1d" }
        );

        const user = await userForm.findById(create._id).select("-password");

         return NextResponse.json(
      { user: { name: user.name, email: user.email, role: user.role }, message: "Registered", accessToken },
      { status: 200 }
    );

    } catch (error) {
        console.error("Error in user registration:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

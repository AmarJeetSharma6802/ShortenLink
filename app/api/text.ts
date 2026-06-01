import userForm from "../api/model/rest.model.js";
import { NextResponse } from "next/server";
import DBconnect from "../api/utils/db.connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

export async function GET() {
  await DBconnect();

  const allUserData = await userForm.find();

  return NextResponse.json(
    { message: "success", allUserData },
    { status: 200 }
  );
}

export async function POST(req: NextRequest) {
  await DBconnect();

  try {
    const { name, email, password, confirmPassword, role } = await req.json();

    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "Please fill in all fields." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const findUser = await userForm.findOne({
      $or: [{ name }, { email }],
    });

    if (findUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const create = await userForm.create({
      name,
      email,
      password: hashedPassword,
      confirmPassword,
      role,
    });

    const accessToken = jwt.sign(
      { _id: create._id, email: create.email },
      process.env.JWTSECRETKEY as string,
      { expiresIn: "1d" }
    );

    const user = await userForm.findById(create._id).select("-password");

    return NextResponse.json(
      {
        user: { name: user.name, email: user.email, role: user.role },
        message: "Registered",
        accessToken,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in user registration:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}


import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: String,
    email: String,
    password: String,
    confirmPassword: String,
    role: String,
  },
  { timestamps: true }
);

const userForm: Model<IUser> =
  mongoose.models.userForm ||
  mongoose.model<IUser>("userForm", userSchema);

export default userForm;

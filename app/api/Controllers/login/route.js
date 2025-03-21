import userForm from "@/app/api/model/model.form.js";
import { NextResponse } from "next/server";
import DBconnect from "@/app/api/utils/db.connect";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
  // const body = await req.json();
  // console.log("Request Body:", body);

  const { email, password } = body;

  // Check for missing fields
  if (!email || !password) {
    return new NextResponse(
      JSON.stringify({ message: "All fields are required" }),
      { status: 400 }
    );
  }

  console.log("Email and Password:", email, password); 

  DBconnect();

  // Query the database for the user
  const user = await userForm.findOne({ email });
  // console.log("User from DB:", user); 

  if (!user) {
    return new NextResponse(
      JSON.stringify({ message: "User not found" }),
      { status: 401 }
    );
  }

  // Check if passwords match
  const matchPassword = await bcrypt.compare(password, user.password);
  // console.log("Password Match:", matchPassword); 

  if (!matchPassword) {
    return new NextResponse(
      JSON.stringify({ message: "Invalid password" }),
      { status: 401 }
    );
  }

  const accessToken = jwt.sign(
    { user_id: user._id, email: user.email },
    process.env.JWTSECRETKEY,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
    { user_id: user._id, email: user.email },
    process.env.REFRESH_JWTSECRETKEY,
    { expiresIn: "5d" }
  );

//   console.log("SECRET_KEY:", process.env.JWTSECRETKEY);
// console.log("REFRESH_JWTSECRETKEY:", process.env.REFRESH_JWTSECRETKEY);

  const response = new NextResponse(
    JSON.stringify({
      user: { _id: user._id, email: user.email },
      message: "User logged in successfully",
      accessToken,
      refreshToken,
    }),
    { status: 200 }
  );

  response.cookies.set("accessToken", accessToken, { httpOnly: true, secure: true, path: "/" });
  response.cookies.set("refreshToken", refreshToken, { httpOnly: true, secure: true, path: "/" });

  return response;
}

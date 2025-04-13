import userForm from "@/app/api/model/model.form.js";
import { NextResponse } from "next/server";
import DBconnect from "@/app/api/utils/db.connect";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await DBconnect();

  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return new NextResponse("Please provide both token and new password", {
        status: 400,
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWTSECRETKEY);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }
    const user = await userForm.findById(decoded.user_id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await user.save()

    return NextResponse.json({message:"Password reset successful"},{status:200})
  } catch (error) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }
}

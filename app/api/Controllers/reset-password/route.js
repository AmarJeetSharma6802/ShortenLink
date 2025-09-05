import userForm from "../../model/model.form";
import { NextResponse } from "next/server";
import DBconnect from "../../utils/db.connect";
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

    const user = await userForm.findOne(
     {
       resetPasswordToken:token,
       resetPasswordTokenExpire: { $gt: Date.now() }
     }
    );
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpire = undefined

    await user.save()

    return NextResponse.json({message:"Password reset successful"},{status:200})
  } catch (error) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
  }
}

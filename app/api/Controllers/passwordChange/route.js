import userForm from "../../model/model.form.js";
import { NextResponse } from "next/server";
import DBconnect from "../../utils/db.connect";
import { authUser } from "../../middleware/authUser";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await DBconnect();
  const { user, error } = await authUser(req);
  // console.log("user from authUser:", user);
  if (error) {
    return error;
  }

  try {
    const { oldPassword, newPassword } = await req.json();

    const User = await userForm.findById(user?._id);

    if (!User) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const isPasswordMatch = await bcrypt.compare(oldPassword, User.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "Old password is incorrect" },
        { status: 401 }
      );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    User.password = hashedPassword;
    await User.save({ validateBeforeSave: false });

    return NextResponse.json(
      { message: "Password changed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

import userForm from "../model/model.form.js";
import { NextResponse } from "next/server.js";
import DBconnect from "../utils/db.connect.js";
import { authUser } from "../middleware/authUser.js";
import { authorize } from "../middleware/authorize.js";

export async function PATCH(req) {
  await DBconnect();
  const { user, error } = await authUser(req);
  if (error) return error;

  // only admin or developer can update other users
  const authError = authorize("admin", "developer")(req, user);
  if (authError) return authError;

  try {
    const { userId, name, email, role } = await req.json();
    if (!userId || !name || !email) {
      return NextResponse.json({ message: "UserId, name, and email required" }, { status: 400 });
    }

    const updatedUser = await userForm.findByIdAndUpdate(
      userId,
      { $set: { name, email, role } },
      { new: true }
    ).select("-password -refreshToken -__v");

    return NextResponse.json({ message: "User updated successfully", updatedUser }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Update failed", error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await DBconnect();
  const { user, error } = await authUser(req);
  if (error) return error;

  const authError = authorize("admin", "developer")(req, user);
  if (authError) return authError;

  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ message: "UserId required" }, { status: 400 });

    await userForm.findByIdAndDelete(userId);
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Delete failed", error: err.message }, { status: 500 });
  }
}

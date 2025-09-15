import { NextResponse } from "next/server";
import { authUser } from "../../middleware/authUser.js";
import DBconnect from "../../utils/db.connect.js";

export async function GET(req) {
  await DBconnect();
  const { user, error } = await authUser(req);
  if (error) return error;
  return NextResponse.json({ message: "Protected data", user });
}

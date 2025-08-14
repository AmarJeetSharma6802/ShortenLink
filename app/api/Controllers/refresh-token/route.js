import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import DBconnect from "../../utils/db.connect";
import userForm from "../../model/model.form";

export async function POST(req) {
  await DBconnect();

  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "No refresh token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWTSECRETKEY);

    const user = await userForm.findById(decoded.user_id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ message: "Invalid refresh token" }, { status: 401 });
    }

    const newAccessToken = jwt.sign(
      { user_id: user._id, email: user.email },
      process.env.JWTSECRETKEY,
      { expiresIn: "15m" }
    );

    const res = NextResponse.json(
      {
        message: "New access token issued",
        accessToken: newAccessToken,
      },
      { status: 200 }
    );
    

    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 15 * 60, // 15 minutes
    });

    return res;
  } catch (error) {
    return NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 403 });
  }
}

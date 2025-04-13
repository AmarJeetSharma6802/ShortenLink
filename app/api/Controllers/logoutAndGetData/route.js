import userForm from "@/app/api/model/model.form.js";
import { NextResponse } from "next/server";
import DBconnect from "@/app/api/utils/db.connect";
import { authUser } from "@/app/api/middleware/authUser.js";

export async function POST(req) {
   await DBconnect();
    const { user, error } = await authUser(req);
    console.log("user from authUser:", user);
    if (error) {
        return error;
    }
 
  try {
    await userForm.findByIdAndUpdate(
      user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      { new: true }
    );
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );

    response.cookies.set("accessToken", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
        path: "/",
      });
      response.cookies.set("refreshToken", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
        path: "/",
      });
  
      return response;

  } catch (error) {}
  console.error("Logout Error:", error); 
  return NextResponse.json({ message: "Logout failed" }, { status: 500 });
}


export async function GET(req) {
  await DBconnect();

  const { user, error } = await authUser(req);
  console.log("user :",  user)
  return NextResponse.json(user,{message:"User fetched Successfully"},{ status: 200 });
}
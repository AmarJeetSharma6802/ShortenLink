import { NextResponse } from "next/server";

export function authorize(...allowedRoles) {
  return (req, user) => {
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { message: "Forbidden: You don't have access" },
        { status: 403 }
      );
    }
    return null;
  };
}
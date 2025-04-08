import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import DBconnect from "@/app/api/utils/db.connect";
import Purchase from "@/app/api/model/PurchaseModel.js";


export async function POST(req) {
    await DBconnect();

    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
        return NextResponse.json({ message: "No access token provided" }, { status: 401 });
    }
    const decoded = jwt.verify(accessToken, process.env.JWTSECRETKEY);
    const userId = decoded.user_id;
    const { item } = await req.json();

    const totalAmount = item.reduce((acc, curr) => {
        return acc + curr.product_price * curr.product_quantity;
      }, 0);
    

      const newPurchase = await Purchase.create({
        userId,
        item,
        totalAmount,
      });

    return NextResponse.json({ message: "Purchase created successfully", newPurchase }, { status: 201 });
}

export async function GET(req) {
    await DBconnect();

        const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) {
        return NextResponse.json({ message: "No access token provided" }, { status: 401 });
    }
    const decoded = jwt.verify(accessToken, process.env.JWTSECRETKEY);
    const userId = decoded.user_id;
    const purchases = await Purchase.find({ userId }).populate("userId", "name email");
    return NextResponse.json({ message: "Purchases retrieved successfully", purchases }, { status: 200 });
}
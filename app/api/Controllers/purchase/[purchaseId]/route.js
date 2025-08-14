import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import DBconnect from "../../../utils/db.connect";
import Purchase from "../../../model/PurchaseModel";

export async function DELETE(req, { params }) {
    await DBconnect()

    const accessToken = req.cookies.get("accessToken")?.value;

    if(!accessToken) {
        return NextResponse.json({ message: "No access token provided" }, { status: 401 });
    }
    const decoded = jwt.verify(accessToken, process.env.JWTSECRETKEY);
    const userId = decoded.user_id;

    const { purchaseId } = params;

    const deleteItem  = await Purchase.findByIdAndDelete({
        _id: purchaseId,
        userId: userId
    });

    if (!deleteItem) {
        return NextResponse.json({ message: "Purchase not found or unauthorized" }, { status: 404 });
      }
    
      return NextResponse.json({ message: "Purchase deleted successfully", deleteItem }, { status: 200 });

}
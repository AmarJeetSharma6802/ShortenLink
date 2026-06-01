import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Ticket from "../../model/tikcet.model";
import DBconnect from "../../utils/db.connect";
import QRCode from "qrcode";

export async function GET(req: Request) {
  await DBconnect();

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    jwt.verify(token, process.env.JWTSECRETKEY!);

    const ticketData = await Ticket.findOne({ token }).lean();

    if (!ticketData) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const qr = await QRCode.toDataURL(token);

    return NextResponse.json({
      status: ticketData.isUsed ? "Already Used" : "Valid",
      name: ticketData.name,
      email: ticketData.email,
      event: ticketData.eventName,
      tickets: ticketData.ticketCount,
      org: ticketData.org,
      token,
      qr,
      isUsed: ticketData.isUsed,
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

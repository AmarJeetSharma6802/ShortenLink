import jwt from "jsonwebtoken";
import Ticket from "../../model/tikcet.model";
import DBconnect from "../../utils/db.connect";

export async function GET(req: Request) {
  await DBconnect();

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json({ status: "Invalid Token" }, { status: 400 });
  }

  try {
    jwt.verify(token, process.env.JWTSECRETKEY!);

    const ticketData = await Ticket.findOne({ token });

    if (!ticketData) {
      return Response.json({ status: "Invalid" }, { status: 404 });
    }

    if (ticketData.isUsed) {
      return Response.json({
        status: "Already Used",
        name: ticketData.name,
        event: ticketData.eventName,
        tickets: ticketData.ticketCount,
      });
    }

    ticketData.isUsed = true;
    await ticketData.save();

    return Response.json({
      status: "Entry Allowed",
      name: ticketData.name,
      event: ticketData.eventName,
      tickets: ticketData.ticketCount,
    });
  } catch {
    return Response.json({ status: "Invalid Token" }, { status: 401 });
  }
}

import { NextResponse } from "next/server";
import ticket from "../../model/tikcet.model";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import transporter from "../../utils/nodemailer";
import { rateLimit } from "../../lib/rateLimit";
import DBconnect from "../../utils/db.connect";

const MAX_TOTAL = 100;
const MAX_PER_USER = 5;

export async function POST(req: Request) {
  await DBconnect();

  const { name, email, contact, eventName, ticketCount, org } = await req.json();
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedTicketCount = Number(ticketCount);

  if (
    !name ||
    !normalizedEmail ||
    !contact ||
    !eventName ||
    !org ||
    !normalizedTicketCount ||
    normalizedTicketCount < 1
  ) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  const allowed = await rateLimit(`rate:${normalizedEmail}`);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const [eventTicketTotal] = await ticket.aggregate([
    { $group: { _id: null, total: { $sum: "$ticketCount" } } },
  ]);

  if ((eventTicketTotal?.total || 0) + normalizedTicketCount > MAX_TOTAL) {
    return NextResponse.json({ error: "Registration closed. Try later." }, { status: 400 });
  }

  if (normalizedTicketCount > MAX_PER_USER) {
    return NextResponse.json({ error: "Max 5 tickets allowed" }, { status: 400 });
  }

  const [userTicketTotal] = await ticket.aggregate([
    { $match: { email: normalizedEmail } },
    { $group: { _id: "$email", total: { $sum: "$ticketCount" } } },
  ]);

  if ((userTicketTotal?.total || 0) + normalizedTicketCount > MAX_PER_USER) {
    return NextResponse.json(
      { error: "This email already reached the max 5 tickets limit" },
      { status: 400 }
    );
  }

  const token = jwt.sign({ email: normalizedEmail }, process.env.JWTSECRETKEY!, {
    expiresIn: "1d",
  });

  const createTicket = await ticket.create({
    name,
    email: normalizedEmail,
    contact,
    eventName,
    ticketCount: normalizedTicketCount,
    org,
    token,
  });

  const qr = await QRCode.toDataURL(token);
  const encodedToken = encodeURIComponent(token);
  const baseUrl = process.env.BASE_URL || new URL(req.url).origin;
  const downloadLink = `${baseUrl}/api/tickets/download-ticket?token=${encodedToken}`;
  const viewLink = `${baseUrl}/scanner/${encodedToken}`;

  await transporter.sendMail({
    to: normalizedEmail,
    subject: "Your Ticket",
    html: `
      <h2>${eventName}</h2>
      <p>${name}</p>
      <p>Tickets: ${normalizedTicketCount}</p>

      <img src="${qr}" width="200"/>

      <br/>
      <a href="${downloadLink}">Download Ticket</a>
      <br/>
      <a href="${viewLink}">View Ticket</a>
    `,
  });

  return NextResponse.json({
    qr,
    ticket: {
      name: createTicket.name,
      email: createTicket.email,
      event: createTicket.eventName,
      tickets: createTicket.ticketCount,
      org: createTicket.org,
      token: createTicket.token,
    },
    viewLink,
    downloadLink,
  });
}

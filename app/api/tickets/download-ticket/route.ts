import Ticket from "../../model/tikcet.model";
import QRCode from "qrcode";
import DBconnect from "../../utils/db.connect";

export const runtime = "nodejs";

const escapeXml = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export async function GET(req: Request) {
  await DBconnect();

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response("Token is required", { status: 400 });
  }

  const ticketData = await Ticket.findOne({ token }).lean();

  if (!ticketData) {
    return new Response("Invalid", { status: 404 });
  }

  const qrSvg = await QRCode.toString(token, {
    type: "svg",
    margin: 1,
    width: 220,
  });

  const ticketSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="420" viewBox="0 0 720 420">
  <rect width="720" height="420" fill="#f8fafc"/>
  <rect x="24" y="24" width="672" height="372" rx="18" fill="#ffffff" stroke="#111827" stroke-width="3"/>
  <rect x="24" y="24" width="672" height="82" rx="18" fill="#d9c0dc"/>
  <text x="56" y="77" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#111827">Event Ticket</text>
  <text x="56" y="154" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" fill="#111827">${escapeXml(ticketData.eventName)}</text>
  <text x="56" y="202" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#111827">Name: ${escapeXml(ticketData.name)}</text>
  <text x="56" y="236" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#111827">Email: ${escapeXml(ticketData.email)}</text>
  <text x="56" y="270" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#111827">Tickets: ${escapeXml(ticketData.ticketCount)}</text>
  <text x="56" y="304" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#111827">Organizer: ${escapeXml(ticketData.org)}</text>
  <svg x="444" y="136" width="220" height="220" viewBox="0 0 220 220">
    ${qrSvg.replace(/<\?xml[^>]*>/g, "").replace(/<\/?svg[^>]*>/g, "")}
  </svg>
</svg>`;

  const safeEventName = String(ticketData.eventName || "ticket")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return new Response(ticketSvg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeEventName || "ticket"}.svg"`,
      "Cache-Control": "no-store",
    },
  });
}

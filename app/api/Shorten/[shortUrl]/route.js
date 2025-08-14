import { NextResponse } from "next/server";
import DBconnect from "../../utils/db.connect";
import ShortenLink from "../../model/model.shortenLink";

export async function GET(req) {
  await DBconnect();

  try {
    const urlParts = req.nextUrl.pathname.split("/"); 
    const shortUrl = urlParts[urlParts.length - 1]; 

    // console.log("Requested Short URL:", shortUrl);

    const existingUrl = await ShortenLink.findOne({ shortUrl });

    if (!existingUrl) {
      return NextResponse.json({ message: "Short URL not found!" }, { status: 404 });
    }

    // console.log("Redirecting to:", existingUrl.originalUrl);

    return NextResponse.redirect(existingUrl.originalUrl);

  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

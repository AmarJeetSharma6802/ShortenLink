import { NextResponse } from "next/server";
import DBconnect from "../utils/db.connect";
import ShortenLink from "../model/model.shortenLink";

export async function POST(req) {
  await DBconnect(); 

  try {
    const { originalUrl, shortUrl } = await req.json();

    if (!originalUrl || !shortUrl) {
      return NextResponse.json({ message: "Please fill in all fields." }, { status: 400 });
    }

    const existingUrl = await ShortenLink.findOne({ shortUrl });

    if (existingUrl) {
      return NextResponse.json({ message: "Already exist URL name" }, { status: 400 });
    }

    const newUrl = await ShortenLink.create({ originalUrl, shortUrl });

    return NextResponse.json(
      {
        message: "Short URL created successfully",
        shortUrl: `${process.env.NEXT_PUBLIC_HOST}/${shortUrl}`,
        success: true,
        newUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

// export async function GET(req, { params }) {
//   await DBconnect();

//   try {
//       const { shortUrl } = params;
//       console.log(params);

//       const existingUrl = await ShortenLink.findOne({ shortUrl });

//       if (!existingUrl) {
//           return NextResponse.json({ message: "URL not found" }, { status: 404 });
//       }

//       console.log("ex :" ,existingUrl.originalUrl)
//       return NextResponse.redirect(existingUrl.originalUrl, { status: 301 });
//   } catch (error) {
//       return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
//   }
// }




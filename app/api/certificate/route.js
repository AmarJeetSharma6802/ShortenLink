import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";
import { NextResponse } from "next/server";

registerFont(path.join(process.cwd(), "public/fonts/GreatVibes-Regular.ttf"), {
  family: "GreatVibes",
});

export async function POST(req) {
  try {
    const { name } = await req.json();

    const certificateImg = await loadImage(
      path.join(process.cwd(), "public/Certificate_Template.png")
    );

    const signatureImg = await loadImage(process.env.SIGNATURE_URL || path.join(process.cwd(), "public/file.svg"));

    const canvas = createCanvas(certificateImg.width, certificateImg.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(certificateImg, 0, 0);

    ctx.fillStyle = '#ffffff'; 
    ctx.fillRect(certificateImg.width / 2 - 120, 190, 200, 60); 
    ctx.fillStyle = '#2d2d2d'; 

   
    ctx.font = '40px GreatVibes';
    ctx.fillStyle = '#2d2d2d';
    ctx.textAlign = 'center';
    ctx.fillText(name, certificateImg.width / 2, 250); 

    ctx.font = '16px Arial';
    ctx.fillText(new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }), 200, 600); // Adjusted for IST

    // Draw signature
    ctx.drawImage(signatureImg, 900, 600, 180, 100); 

    const buffer = canvas.toBuffer("image/png");
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="certificate.png"`,
      },
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    return new NextResponse("Error generating certificate", { status: 500 });
  }
}
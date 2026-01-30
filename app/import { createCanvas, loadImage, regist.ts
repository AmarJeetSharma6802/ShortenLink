// import { createCanvas, loadImage, registerFont } from "canvas";
// import path from "path";
// import { NextResponse } from "next/server";

// registerFont(path.join(process.cwd(), "public/fonts/GreatVibes-Regular.ttf"), {
//   family: "GreatVibes",
// });

// export async function POST(req) {
//   const { name } = await req.json();

//   const certificateImg = await loadImage(
//     path.join(process.cwd(), "public/Certificate_Template.png")
//   );

//   const signatureImg = await loadImage(process.env.SIGNATURE_URL);

//   // Create canvas

//   const canvas = createCanvas(certificateImg.width, certificateImg.height);
//   const ctx = canvas.getContext("2d");

//   //    Draw certificate

//   ctx.drawImage(certificateImg, 0, 0);

//   // Draw name in the certificate 

//   ctx.font = '45px GreatVibes';
//   ctx.fillStyle = '#2d2d2d';
//   ctx.textAlign = 'center';
//     ctx.fillText(name, certificateImg.width / 2, 240);


//     // Draw date
//   ctx.font = '16px Arial';
//   ctx.fillText(new Date().toLocaleDateString(), 500, 50);

  
//   // Draw signature
//   ctx.drawImage(signatureImg, 960, 600, 180, 100);
  
//   const buffer = canvas.toBuffer("image/png");

//     return new NextResponse(buffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "image/png",
//         "Content-Disposition": `attachment; filename="certificate.png"`,
//       },
//     });
// }

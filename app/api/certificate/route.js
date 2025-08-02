import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import { NextResponse } from 'next/server';


registerFont(path.join(process.cwd(), 'public/fonts/GreatVibes-Regular.ttf'), {
  family: 'GreatVibes',
});

export async function POST(req){
    const {name} = await req.json()

    const certificateImg = await loadImage(
          path.join(process.cwd(), 'public/Certificate_Template.png')
    )

    const signatureImg  = await loadImage(process.env.SIGNATURE_URL);

    
  // Create canvas

     const canvas = createCanvas(certificateImg.width, certificateImg.height);
  const ctx = canvas.getContext('2d');

//    Draw certificate
}


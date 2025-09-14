import { NextResponse } from "next/server"
import item from "../model/rest.model"
import DBconnect from "../utils/db.connect.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { writeFile } from "fs/promises";
import path from "path";
import fs from 'fs'


export async function GET(){
await DBconnect()
const items = await item.find();
return NextResponse.json(items)
}

// export async function POST(req){
//     await DBconnect()

//     const formData = await req.formData();
//     const name = formData.get("name");
//     const age = formData.get("age");
//     const file = formData.get("image");

//     if (!file) {
//         return NextResponse.json({ error: "Image is required" }, { status: 400 });
//       }
//       const buffer =  Buffer.from(await file.arrayBuffer()); 
      

//     const tempFilePath = path.join("public", "temp", file.name);
//     await writeFile(tempFilePath, buffer); 

//     const uploaded = await uploadOnCloudinary(tempFilePath);

// if (!uploaded) {
//       return NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 });
//     }

//     const details = await item.create({
//         name,
//         age,
//         image:uploaded.secure_url
//     })
//     return NextResponse.json({ message: "details Created", details }, { status: 201 });
// }

export async function POST(req) {
  await DBconnect();

  const formData = await req.formData();
  const name = formData.get("name");
  const age = formData.get("age");
  const images = formData.getAll("image");

  if (!name || !age) {
    return NextResponse.json({ message: "All fields required" }, { status: 400 });
  }

  if (!images || images.length === 0) {
    return NextResponse.json({ message: "Images required" }, { status: 400 });
  }

  const uploadedImages = [];

  for (let image of images) {
    const buffer = Buffer.from(await image.arrayBuffer());
    const tempFilePath = path.join("/tmp", image.name);
    await writeFile(tempFilePath, buffer);

    const uploadedImage = await uploadOnCloudinary(tempFilePath);

    if (!uploadedImage) {
      return NextResponse.json({ error: "Cloudinary image upload failed" }, { status: 500 });
    }

    uploadedImages.push(uploadedImage.secure_url);
  }

  const details = await item.create({
    name,
    age,
    image: uploadedImages,
  });

  return NextResponse.json({ message: "Details Created", details }, { status: 201 });
}
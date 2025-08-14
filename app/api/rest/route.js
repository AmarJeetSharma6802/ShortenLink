import { NextResponse } from "next/server"
import item from "../model/rest.model"
import DBconnect from "../utils/db.connect.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(){
await DBconnect()
const items = await item.find();
return NextResponse.json(items)
}

export async function POST(req){
    await DBconnect()

    const formData = await req.formData();
    const name = formData.get("name");
    const age = formData.get("age");
    const file = formData.get("image");

    if (!file) {
        return NextResponse.json({ error: "Image is required" }, { status: 400 });
      }
      const buffer =  Buffer.from(await file.arrayBuffer()); // यह लाइन अपलोड की गई फाइल को binary format (buffer) में बदल देती है।
      //  //Buffer.from(...) → उस raw डेटा को Node.js के Buffer ऑब्जेक्ट में बदल देता है, ताकि हम उसे डिस्क में लिख सकें।

    const tempFilePath = path.join("public", "temp", file.name);
    await writeFile(tempFilePath, buffer); //यह लाइन उस फाइल को डिश्क (hard disk) पर अस्थायी रूप से सेव करती है।

    const uploaded = await uploadOnCloudinary(tempFilePath);

if (!uploaded) {
      return NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 });
    }

    const details = await item.create({
        name,
        age,
        image:uploaded.secure_url
    })
    return NextResponse.json({ message: "details Created", details }, { status: 201 });
}
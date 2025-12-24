import { NextResponse } from "next/server";
import { imagekit } from "../utils/imagekitKeys.js";
import DBconnect from "../utils/db.connect.js";
import item from "../model/rest.model.js";


export async function  GET(){
  await DBconnect()

  const foundItem = await item.find()
  return NextResponse.json({message:"Succefully Found", foundItem} ,{ status: 201 })
}


export async function POST(req){
await DBconnect()

try {
    const  formData =  await req.formData()
     const name = formData.get("name");
    const age = parseInt(formData.get("age"));
    const file = formData.get("image")

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploaded = await imagekit.upload({
          file: buffer,
           fileName: file.name,
      useUniqueFileName: true,
    })
    
    const newItem = await item.create({
      name,
      age,
      image: uploaded.url,
    });
     return NextResponse.json({ message: "Uploaded successfully", data: newItem }, { status: 201 });

} catch (error) {
 return NextResponse.json({ message:"error"}, { status: 500 });
}
}



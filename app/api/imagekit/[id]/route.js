import { NextResponse } from "next/server";
import { imagekit } from "../../utils/imagekitKeys";
import item from "../../model/rest.model";
import DBconnect from "../../utils/db.connect";

export async function PUT(req,{params}){
await DBconnect()

const id = params.id
try {
    
     const formData = await req.formData();
    const name = formData.get("name");
    const age = formData.get("age");
    const file = formData.get("image"); 

    const buffer = Buffer.from(await file.arrayBuffer());

     const uploaded = await imagekit.upload({
        file: buffer,
        fileName: file.name,
        useUniqueFileName: true,
      });
      const updatedItem  = await item.findByIdAndUpdate(
        id,
        {
            name,
            age,
            image:uploaded.url
        },
        {
            new:true
        }
      )
       if (!updatedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
      return NextResponse.json({
      message: "Item updated successfully",
      data: updatedItem,
    });

} catch (error) {
     return NextResponse.json({ error: error.message }, { status: 500 });
}
}
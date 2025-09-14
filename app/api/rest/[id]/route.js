import { NextResponse } from "next/server";
import DBconnect from "../../utils/db.connect.js";
import item from "../../model/rest.model.js";
import { writeFile, mkdir } from "fs/promises";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import fs from "fs";

export async function GET(req, { params }) {
  await DBconnect();

  const id = params.id;

  try {
    const foundItem = await item.findById(id);

    if (!foundItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Item found successfully", item: foundItem },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid ID or database error", details: error.message },
      { status: 500 }
    );
  }
}

// export async function PUT(req, { params }) {
//   await DBconnect();

//   const id = params.id; 

//   try {
//     const formData = await req.formData();
//     const name = formData.get("name");
//     const age = formData.get("age");
//     const file = formData.get("image");

//     let updatedData = { name, age };

//     if (file && file.name) {
//       const buffer = Buffer.from(await file.arrayBuffer());

//       // ✅ Ensure directory exists
//       const tempDir = "./public/temp";
//       await mkdir(tempDir, { recursive: true }); 

//       const tempFilePath = `${tempDir}/${file.name}`;
//       await writeFile(tempFilePath, buffer);

//       const uploaded = await uploadOnCloudinary(tempFilePath);

//       if (!uploaded) {
//         return NextResponse.json(
//           { error: "Cloudinary upload failed" },
//           { status: 500 }
//         );
//       }

//       updatedData.image = uploaded.secure_url;
//       // console.log("Uploaded response from Cloudinary:", uploaded);

//       // ✅ Delete temp file
//       if (fs.existsSync(tempFilePath)) {
//         fs.unlinkSync(tempFilePath);
//       }
//     }

//     const updatedItem = await item.findByIdAndUpdate(id, updatedData, {
//       new: true,
//     });

//     if (!updatedItem) {
//       return NextResponse.json({ error: "Item not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       { message: "Item updated successfully", item: updatedItem },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Update failed", details: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(req,{params}) {
  await DBconnect();

  const {id} = params

  const formData = await req.formData();
  const name = formData.get("name");
  const age = formData.get("age");
  const images = formData.getAll("image");

  let updateData = {name,age}

    if (images && images.length > 0) {
        const uploadedImages = [];
        const tempDir = "/tmp";
      await  mkdir(tempDir , {recursive:true})

      for(let image of images){
       
        const buffer  = Buffer.from(await image.arrayBuffer())
        const tmpfilePath  = `${tempDir}/${image.name}`
        await writeFile(tmpfilePath,buffer)

        const updatedData = await uploadOnCloudinary(tmpfilePath,image.name)

        if (!updatedData) {
        return NextResponse.json(
          { error: "Cloudinary image upload failed" },
          { status: 500 }
        );
      }
      uploadedImages.push(updatedData.secure_url)

        if (fs.existsSync(tmpfilePath)) {
        fs.unlinkSync(tmpfilePath);
      }
      }
      
      updateData.image = uploadedImages;
    }

    const updatedItem = await item.findByIdAndUpdate(
      id,
      updateData,
      {new:true}
    )

     return NextResponse.json(
      { message: "Item updated successfully", item: updatedItem },
      { status: 200 }
    );
}

export async function PATCH(req,{params}){
  const id =  params.id

  const {name ,age} = await req.json()

if(!name  || !age){
            return NextResponse.json({ message: "Name and age are required" }, { status: 400 });
        }

    const user = await item.findByIdAndUpdate(
      id,
      {
        $set:{
          name:name,
          age:age,
        }
      },
      {new :true}
    )    

     return NextResponse.json(user,{message :"account update succcefully"}, { status: 200 });
    
}

export async function DELETE(req, { params }) {
  await DBconnect()

  const id = params.id
  try {
    const DeleteItem = await item.findByIdAndDelete(id)

    if (!DeleteItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Item deleted successfully", item: DeleteItem },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Delete failed", details: error.message },
      { status: 500 }
    );
  }
}

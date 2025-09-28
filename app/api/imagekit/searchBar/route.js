import { NextResponse } from "next/server";
import Item from "../../model/rest.model";
import DBconnect from "../../utils/db.connect.js";

export async function GET(request) {
  await DBconnect();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";
  const selected = searchParams.get("selected")?.toLowerCase() || "";

  try {
 
    let filtered = await Item.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
      ],
    }).lean();

   
    if (selected) {
      const selectedMatch = filtered.filter((item) =>
        item.name.toLowerCase().includes(selected)
      );
      const rest = filtered.filter(
        (item) => !item.name.toLowerCase().includes(selected)
      );
      filtered = [...selectedMatch, ...rest];
    }

    return NextResponse.json(filtered);
    
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

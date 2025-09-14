import { NextResponse } from "next/server";
import Item from "../../model/rest.model.js";
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
        { brand: { $regex: query, $options: "i" } },
      ],
    }).lean();

    // selected item ko first laane ka logic
    if (selected) {
      filtered = [
        ...filtered.filter((item) =>
          item.name.toLowerCase().includes(selected)
        ),
        ...filtered.filter(
          (item) => !item.name.toLowerCase().includes(selected)
        ),
      ];
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

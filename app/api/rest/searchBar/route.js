import { NextResponse } from "next/server"
import item from "@/app/api/model/rest.model.js"
import DBconnect from "../../utils/db.connect.js";


export async function GET(req){
    await DBconnect()
    try {
        const {searchParams} = new URL(req.url)
        const query = searchParams.get("query") || "";

        const results = await item.find({
          name: { $regex: query, $options: "i" },
          });

          return Response.json({
            message: "Search results",
            results,
          });

    } catch (error) {
        return Response.json(
      { message: "Search failed", error: error.message },
      { status: 500 }
    );
    }
} 

// http://localhost:3000/api/rest/searchBar?query=amarjeet

// req.url = "/api/rest/searchBar?query=amarjeet"
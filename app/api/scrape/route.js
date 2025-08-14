import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const url = "https://internshala.com/internships";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let internships = [];

    $(".individual_internship").each((i, el) => {
      const title = $(el).find(".heading_4_5.profile").text().trim();
      const company = $(el).find(".company_name").text().trim();
      const location = $(el).find(".location_link").text().trim();
      internships.push({ title, company, location });
    });

    return new Response(JSON.stringify({ internships }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

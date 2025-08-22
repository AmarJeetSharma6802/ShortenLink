import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    // const url = "https://internshala.com/internships";
    const url = "https://www.glassdoor.co.in/Job/index.htm";
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let internships = [];

    $(".individual_internship").each((i, el) => {
      const title = $(el).find(".job-internship-name").text().trim();
      const company = $(el).find(".company-name").text().trim();
      const location = $(el).find(".locations").text().trim();
      const salary = $(el).find(".stipend").text().trim();
      internships.push({ title, company, location, salary });
    });

    return new Response(JSON.stringify({ internships }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

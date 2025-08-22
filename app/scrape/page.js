"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/scrape")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData.internships || []);
      });
  }, []);


  const parseSalary = (salaryStr) => {
    if (!salaryStr) return 0;
    const match = salaryStr.replace(/[^0-9]/g, ""); // sirf number nikalna
    return match ? parseInt(match, 10) : 0;
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
        Scraped Internships
      </h1>
      <div className="scrape_flex">
        {data
          .filter((item) => parseSalary(item.salary) > 12000) 
          .map((item, i) => (
            <div key={i} className="scrape">
              <ul>
                <li>title: {item.title}</li>
                <li>company name: {item.company}</li>
                <li>location: {item.location}</li>
                <li>salary: {item.salary}</li>
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}

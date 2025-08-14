"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/scrape")
      .then(res => res.json())
      .then(resData => {
        // console.log(resData); 
        setData(resData.internships || []); 
      });
  }, []);

  return (
    <div>
      <h1>Scraped Internships</h1>
      {
        data.map((item, i) => (
          <p key={i}>
            <b>{item.title}</b> — {item.company} ({item.location})
          </p>
        ))
       
      }
    </div>
  );
}

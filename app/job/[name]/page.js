import React from "react";
import Dynaimcpage from "./Dynaimcpage.jsx"




export default async function Page({ params }) {
  const { name } = await params;

  const res = await fetch("http://localhost:5000/job/alljobs", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const data = await res.json();

  const slugify = (job) => {
    return job .toLowerCase()
    .replace(/[,]/g, "")        
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  };

  const selectedContent = data.findjobs.find(
    (item) => slugify(item.companyName) === name
  );

  if (!selectedContent) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      
      <Dynaimcpage selectedContent={selectedContent}/>
    </div>
  );
}

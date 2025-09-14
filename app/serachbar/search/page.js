"use client";
// import item from "@/app/api/model/rest.model";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


export default function BatsPage() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const selected = searchParams.get("selected") || "";
  const [bats, setBats] = useState([]);

  useEffect(() => {
    const fetchBats = async () => {
      const res = await fetch(`/api/imagekit/searchBar?q=${query}&selected=${selected}`);
      const data = await res.json();
      setBats(data);
    };
    fetchBats();
  }, [query, selected]);

  const handleclick =(name)=>{
        const slug = name.trim()
        .toLowerCase() 
        .replace(/[,]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
        router.push(`/item/${slug}`)
  }
  return (
    <div className="container">
      <h1 className="title">Results for "{query}"</h1>

      {bats.length === 0 ? (
        <p className="no-data">No bats found.</p>
      ) : (
        <ul className="list">
          {bats.map((item, index) => (
            <li
              key={item._id}
              className=""
            >
              <img src={item.image} alt={item.name} width={50} />
              <h2 className="item-title">{item.name}</h2>
              <button onClick={()=> handleclick(item.name)}>details</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

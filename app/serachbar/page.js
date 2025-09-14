"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) {
      const res = await fetch(`/api/imagekit/searchBar?q=${value}`);
      const data = await res.json();
      setResults(data);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (bat) => {
   
    router.push(`/serachbar/search?q=${query}&selected=${bat.name}`);
  };

  return (
    <div className="">
      <h1 className=""> Search</h1>
      <input
        type="text"
        placeholder="Search bats by brand or name..."
        value={query}
        onChange={handleSearch}
        className=""
      />

      {results.length > 0 && (
        <ul className="">
          {results.map((bat) => (
            <li
              key={bat._id}
              className="p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(bat)}
            >
              {bat.name}{" "}
              
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

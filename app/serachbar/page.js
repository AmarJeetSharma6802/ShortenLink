"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1); // track active item for keyboard navigation
  const router = useRouter();
  const inputRef = useRef(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1); // reset active index on new input

    if (value.length > 1) {
      const res = await fetch(`/api/imagekit/searchBar?q=${value}`);
      const data = await res.json();
      setResults(data);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.name); // set the search bar to selected item
    router.push(`/serachbar/search?q=${query}&selected=${item.name}`);
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < results.length) {
        handleSelect(results[activeIndex]);
      }
    }
  };

  return (
    <div className="search-container">
      <h1>Search</h1>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search bats by brand or name..."
        value={query}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        className="search-input"
      />

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((bat, index) => (
            <li
              key={bat._id}
              className={index === activeIndex ? "active" : ""}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
              onClick={() => handleSelect(bat)}
            >
              {bat.name}
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .search-results {
          list-style: none;
          margin: 0;
          padding: 0;
          border: 1px solid #ccc;
          max-height: 200px;
          overflow-y: auto;
        }
        .search-results li {
          padding: 8px 12px;
          cursor: pointer;
        }
        .search-results li.active {
          background-color: #0070f3;
          color: white;
        }
      `}</style>
    </div>
  );
}

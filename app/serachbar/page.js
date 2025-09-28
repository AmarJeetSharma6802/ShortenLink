"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef(null);
  const itemRefs = useRef([]); // for scrolling active item into view

  // Fetch results from API
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setActiveIndex(-1);

    if (value.length > 1) {
      try {
        const res = await fetch(`/api/imagekit/searchBar?q=${value}`);
        const data = await res.json();
        setResults(data);
        console.log("Search results:", results);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setResults([]);
      }
    } else {
      setResults([]);
    }
  };

  // Select an item
  const handleSelect = (item) => {
    setQuery(item.name);
    router.push(`/serachbar/search?q=${item.name}&selected=${item.name}`);
    setResults([]);
  };

  // Keyboard navigation
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

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

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
        spellCheck="false"
      />

      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((bat, index) => (
            <li
              key={bat._id}
              ref={(el) => (itemRefs.current[index] = el)}
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
        .search-container {
          position: relative; /* important for dropdown */
          width: 300px;
          margin: 50px auto;
        }
        .search-input {
          width: 100%;
          padding: 8px 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          outline: none;
          box-sizing: border-box;
        }
        .search-results {
          list-style: none;
          margin: 0;
          padding: 0;
          border: 1px solid #ccc;
          max-height: 200px;
          overflow-y: auto;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          z-index: 1000;
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

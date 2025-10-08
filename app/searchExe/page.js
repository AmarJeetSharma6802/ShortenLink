"use client";
import { useState, useEffect } from "react";

export default function SearchPanel() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setHistory(saved);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newHistory = [query, ...history.filter(h => h !== query)].slice(0,5);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    setHistory(newHistory);

    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    setQuery("");
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search Google..."
          autoFocus
          style={styles.input}
        />
      </form>

      <div style={styles.historyContainer}>
        <h3 style={styles.historyTitle}>Recent Searches</h3>
        {history.map((item, i) => (
          <p
            key={i}
            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(item)}`, "_blank")}
            style={styles.historyItem}
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.8)",
    color: "#fff",
    borderRadius: "15px",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  input: {
    padding: "10px",
    borderRadius: "10px",
    width: "350px",
    marginBottom: "10px",
    border: "none",
    outline: "none",
    fontSize: "16px",
  },
  historyContainer: {
    width: "350px",
  },
  historyTitle: {
    color: "#aaa",
    fontSize: "14px",
    marginBottom: "5px",
  },
  historyItem: {
    cursor: "pointer",
    color: "#ddd",
    marginBottom: "3px",
  },
};

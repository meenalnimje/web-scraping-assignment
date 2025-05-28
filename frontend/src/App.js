import React, { useState, useEffect } from "react";
import "./App.css";
import ResultCard from "./ResultCard";

// Utility to convert shorthand counts like "1.8k" to 1800
function parseCount(countStr) {
  if (!countStr) return 0;
  const lower = countStr.toLowerCase().trim();

  if (lower.endsWith("k")) {
    return parseFloat(lower.replace("k", "")) * 1000;
  } else if (lower.endsWith("m") || lower.endsWith("M")) {
    return parseFloat(lower.replace("m", "")) * 1000000;
  } else {
    return parseInt(lower.replace(/[^0-9]/g, ""), 10) || 0;
  }
}

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [originalResults, setOriginalResults] = useState([]);
  const [sortByUpvotes, setSortByUpvotes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch(
        `https://web-scraping-assignment.vercel.app/api/reddit?query=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      let fetchedResults = data.data;

      setOriginalResults(fetchedResults);
      setResults(fetchedResults);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sortByUpvotes) {
      const sorted = [...results].sort(
        (a, b) => parseCount(b.upvotes) - parseCount(a.upvotes)
      );
      setResults(sorted);
    } else {
      setResults(originalResults);
    }
  }, [sortByUpvotes]);

  return (
    <div className="app">
      <h1>Reddit Mention Scraper</h1>

      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter company or person"
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="sort-toggle">
        <label>
          <input
            type="checkbox"
            checked={sortByUpvotes}
            onChange={(e) => setSortByUpvotes(e.target.checked)}
          />
          Sort by Upvotes
        </label>
      </div>

      {isLoading && <p>Loading results...</p>}

      <div className="results">
        <span>Result Counter {results?.length}</span>
        {!isLoading &&
          results?.map((item, index) => <ResultCard key={index} item={item} />)}
      </div>
    </div>
  );
}

export default App;

import React from "react";
import "./ResultCard.css";

function ResultCard({ item }) {
  return (
    <div className="result-card">
      <a href={item.link} target="_blank" rel="noopener noreferrer">
        <h3>{item.title}</h3>
      </a>
      <p>
        Upvotes: {item.upvotes} | Comments: {item.comments}
      </p>
    </div>
  );
}

export default ResultCard;

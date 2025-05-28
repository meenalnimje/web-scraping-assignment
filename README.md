# 🔍 Reddit Mention Scraper

A full-stack web application to scrape Reddit mentions of a company or person from the past 7 days using Puppeteer and display them in a sorted list by upvotes.

## Demo

- Video :- https://drive.google.com/file/d/1ROjVmBZvW_pr3bzcIe-tcA1fqc3DMST1/view?usp=sharing

  
## 🚀 Features

- Scrapes Reddit posts from search results (last week).
- Displays title, upvotes, comments, and link.
- Sorts results by upvotes (optional toggle).
- Human-like delays and stealth mode to avoid detection.

---

## 🛠 Tech Stack

- *Frontend:* React.js (with basic styling)
- *Backend:* Node.js + Express
- *Web Scraping:* Puppeteer + Stealth Plugin
- 
---

## ⚙ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/meenalnimje/web-scraping-assignment.git
open folder web-scraping-assignment
```

### 2. Install Backend Dependencies
```bash
cd Backend
npm install

Ensure that these dependencies are installed 
  "cors": "^2.8.5",
  "dotenv": "^16.5.0",
  "express": "^5.1.0",
  "puppeteer": "^24.9.0",
  "puppeteer-extra": "^3.3.6",
  "puppeteer-extra-plugin-stealth": "^2.11.2"
```


### 3. Start Backend Server
```bash
node index.js
Server runs at: http://localhost:5000
```

### 4. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 5. Start React Frontend
```bash
npm start
App runs at: http://localhost:3000
```

### How to use
- Enter a keyword (e.g., "Tesla") in the search input.

- Click Search.

- wait for few seconds(up to 60 sec) to scrape the data fully.

- Toggle "Sort by Upvotes" to view the most upvoted mentions first.

- Click any result to open the Reddit post.

### 📌 Notes
- Backend uses Puppeteer headless browser for scraping, which may take a few seconds.

- Results are limited to posts from the last 7 days.

- Avoid overloading Reddit with too many requests too quickly to prevent temporary blocks.

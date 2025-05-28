const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
require("dotenv").config();
puppeteer.use(StealthPlugin());

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// Delay utility
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrapeRedditMentions(query) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
  );

  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
  });

  const url = `https://www.reddit.com/search/?q=${encodeURIComponent(
    query
  )}&t=week`;
  await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

  // Infinite scrolling
  let previousHeight;
  let retries = 0;

  while (retries < 3) {
    try {
      previousHeight = await page.evaluate("document.body.scrollHeight");
      await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
      await delay(1000 + Math.random() * 500); // human-like delay
      const newHeight = await page.evaluate("document.body.scrollHeight");

      if (newHeight === previousHeight) {
        retries++;
      } else {
        retries = 0;
      }
    } catch (err) {
      console.error("Scroll error:", err);
      break;
    }
  }

  // Scrape post data
  const results = await page.evaluate(() => {
    const posts = [];
    const containers = document.querySelectorAll(
      'search-telemetry-tracker[data-testid="search-sdui-post"]'
    );

    containers.forEach((container) => {
      const postUnit = container.querySelector(
        'div[data-testid="search-post-unit"]'
      );
      if (!postUnit) return;

      const postContent = postUnit.querySelector(
        'div[data-testid="sdui-post-unit"]'
      );
      const titleAnchor = postContent?.querySelector(
        'a[data-testid="post-title-text"]'
      );
      const postTitle = titleAnchor?.innerText || "";
      const postLink = titleAnchor?.href || "";

      const countersDiv = postUnit.querySelector(
        'div[data-testid="search-counter-row"]'
      );
      const faceplateNumbers =
        countersDiv?.querySelectorAll("faceplate-number");

      const upvotes = faceplateNumbers?.[0]?.innerText || "0";
      const comments = faceplateNumbers?.[1]?.innerText || "0";

      posts.push({
        title: postTitle,
        link: postLink,
        upvotes,
        comments,
      });
    });

    return posts;
  });

  await browser.close();
  return results;
}

// API route
app.get("/api/reddit", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "Query is required." });

  try {
    const results = await scrapeRedditMentions(query);
    res.json({ count: results.length, data: results });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ error: "Failed to scrape Reddit." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

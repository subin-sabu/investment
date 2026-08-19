// index.js

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import calculateFundGrowth from "./services/calculateFundGrowth.js";

const app = express();
const PORT = process.env.PORT || 3000;

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Generate Quote
app.post("/generate-quote", (req, res) => {
  try {
    let { premium, ppt, pt, cagr } = req.body;

    premium = Number(premium);
    ppt = Number(ppt);
    pt = Number(pt);
    cagr = Number(cagr);

    // Validation
    if (
      !Number.isFinite(premium) ||
      !Number.isFinite(ppt) ||
      !Number.isFinite(pt) ||
      !Number.isFinite(cagr) ||
      premium <= 0 ||
      ppt <= 0 ||
      pt <= 0 ||
      cagr <= 0 ||
      cagr > 18 || // Maximum CAGR is 18%
      ppt > 40|| // Maximum PPT is 40 years
      pt > 50 || // Maximum PT is 50 years
      ppt > pt
    ) {
      return res.status(400).json({
        message:
          "Unrealistic values provided. Please check your inputs.",
      });
    }

    if (
      pt <= 10 && 
      cagr > 15 
    ) {
      return res.status(400).json({
        message:
          "Values provided are unrealistic. For a period of 10 years or less, the average CAGR should not exceed 15%.",
      });
    }




    const imageBuffer = calculateFundGrowth({
      premium,
      ppt,
      pt,
      cagr,
    });

    res.setHeader("Content-Type", "image/png");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="InvestmentQuote.png"',
    );

    res.send(imageBuffer);
  } catch (err) {
    console.error("Error generating quote:", err);

    res.status(500).json({
      message: "Failed to generate quote.",
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

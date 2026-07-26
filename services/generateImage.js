// services/generateImage.js

import { createCanvas } from "canvas";

function generateImage({
  data,
  premium,
  ppt,
  pt,
  cagr,
  maturity,
}) {

  // A4 Portrait @300 DPI
  const width = 2480;
  const height = 3508;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  //-----------------------------------------
  // Background
  //-----------------------------------------
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  //-----------------------------------------
  // Title
  //-----------------------------------------

  ctx.fillStyle = "#003366";
  ctx.font = "bold 72px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    `Invest for ${pt} Years and Get ₹${maturity.toLocaleString("en-IN")}`,
    width / 2,
    110
  );

  ctx.fillStyle = "#00843D";
  ctx.font = "bold 42px Arial";
  ctx.fillText(
    "Invest with India's Top Insurer - HDFC Life",
    width / 2,
    170
  );

  //-----------------------------------------
  // Withdrawal Highlight
  //-----------------------------------------

  ctx.fillStyle = "#FFF8D6";
  ctx.fillRect(120, 220, width - 240, 110);

  ctx.strokeStyle = "#F4B400";
  ctx.lineWidth = 5;
  ctx.strokeRect(120, 220, width - 240, 110);

  ctx.fillStyle = "#D84315";
  ctx.font = "bold 52px Arial";
  ctx.fillText(
    "Funds can be withdrawn anytime after 5 years",
    width / 2,
    292
  );

  //-----------------------------------------
  // Summary
  //-----------------------------------------

  ctx.textAlign = "left";

  ctx.fillStyle = "#222";
  ctx.font = "bold 38px Arial";

  ctx.fillText(
    `Annual Investment : ₹${premium.toLocaleString("en-IN")}`,
    120,
    410
  );

  ctx.fillText(
    `Premium Paying Term : ${ppt} Years`,
    120,
    470
  );

  ctx.fillText(
    `Policy Term : ${pt} Years`,
    120,
    530
  );

  ctx.fillText(
    `Projected CAGR : ${cagr}%*`,
    120,
    590
  );

  //-----------------------------------------
//-----------------------------------------
// Table
//-----------------------------------------

const startY = 680;
const headerHeight = 68;
const rowHeight = 60;

ctx.fillStyle = "#0B4F8A";
ctx.fillRect(100, startY, width - 200, headerHeight);

// Header
ctx.fillStyle = "#fff";
ctx.font = "bold 39px Arial";   // was 34 (+15%)
ctx.textAlign = "left";

ctx.fillText("Year", 170, startY + 45);
ctx.fillText("Investment (₹)", 520, startY + 45);
ctx.fillText("Fund Value at the End of Year (₹)", 1430, startY + 45);

// Body
ctx.font = "bold 34px Arial";   // was 30 (+13-15%)

data.forEach((row, i) => {

  const y = startY + headerHeight + rowHeight * i;

  ctx.fillStyle =
    i % 2 === 0
      ? "#F8F8F8"
      : "#FFFFFF";

  ctx.fillRect(
    100,
    y,
    width - 200,
    rowHeight
  );

  ctx.fillStyle = "#000";

  ctx.fillText(
    row.Year.toString(),
    170,
    y + 40
  );

  ctx.fillText(
    row.Investment.toLocaleString("en-IN"),
    520,
    y + 40
  );

  ctx.fillText(
    row.FundValue.toLocaleString("en-IN"),
    1430,
    y + 40
  );

  ctx.strokeStyle = "#DDDDDD";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(100, y + rowHeight);
  ctx.lineTo(width - 100, y + rowHeight);
  ctx.stroke();
});
//----------------------------------------
// Disclaimer
//-----------------------------------------

const boxX = 90;
const boxY = startY + headerHeight + rowHeight * data.length + 140;
const boxWidth = width - 180;
const boxHeight = 150;

ctx.fillStyle = "#F7F7F7";
ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

ctx.strokeStyle = "#BBBBBB";
ctx.lineWidth = 3;
ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

ctx.fillStyle = "#333";
ctx.font = "bold 24px Arial";

const disclaimer = [
  `*The projected fund growth of ${cagr}% is based on the historical performance of HDFC Life ULIP funds such as Discovery Fund, Flexi Cap Fund and similar equity-oriented funds.`,
  "",
  "Investments are subject to market risks. Please read all scheme related documents carefully before investing. Past performance is not indicative of future returns."
];

let textY = boxY + 40;

disclaimer.forEach(line => {
  ctx.fillText(line, boxX + 20, textY);
  textY += 34;
});

  //-----------------------------------------
  // Return the image buffer
  //-----------------------------------------

 return canvas.toBuffer("image/png");
}

export default generateImage;
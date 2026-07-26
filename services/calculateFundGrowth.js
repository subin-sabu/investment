// services/calculateFundGrowth.js

import  generateImage  from "./generateImage.js";

function calculateFundGrowth({
  premium,
  ppt,
  pt,
  cagr = 15,
}) {
  const rate = cagr / 100;

  const investments = [];
  const results = [];

  for (let year = 1; year <= pt; year++) {

    if (year <= ppt) {
      investments.push(premium);
    }

    for (let i = 0; i < investments.length; i++) {
      investments[i] *= (1 + rate);
    }

    const fundValue = investments.reduce((sum, value) => sum + value, 0);

    results.push({
      Year: year,
      Investment: year <= ppt ? premium : 0,
      FundValue: Math.round(fundValue),
    });
  }

  return generateImage({
    data: results,
    premium,
    ppt,
    pt,
    cagr,
    maturity: results[results.length - 1].FundValue,
  });
}

export default calculateFundGrowth;

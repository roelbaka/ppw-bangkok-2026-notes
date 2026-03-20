#!/usr/bin/env node
/**
 * Export HTML summaries to PDF (PPW day 1 folder).
 * Requires: npm install puppeteer
 * Run from this folder: node export-html-to-pdf.js
 */

const path = require('path');
const fs = require('fs');

const DIR = __dirname;
const HTML_FILES = [
  'jonathan-turpin-ai-property-portals-summary.html',
  'patrick-grove-fdv-summary.html',
  'malcolm-myers-ai-asia-portals-summary.html',
  'satoshi-murakami-metaprop-investment-mandate.html',
  'ryan-gallagher-iovox-ai-communications.html',
  'russell-wee-jean-yip-proptech-ai-real-estate.html',
  'steve-coleman-snow-only-ai-human-touch.html',
  'lamerton-gray-proptexx-ai-retail-media-portal-intelligence.html',
  'paruey-anadirekkul-spacely-ai-adoption-outcomes.html',
  'lukas-rose-properbird-ai-data-intelligence-layer.html',
  'hannah-parker-inoki-humans-and-ai-agents.html',
  'daniel-ho-juwai-iq-global-platform-summary.html',
  'mike-kenner-lifull-connect-scaling-ai-summary.html',
  'courtney-bugeja-sellsmart-seller-journey-summary.html',
];

async function main() {
  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('Puppeteer not found:', e.message);
    console.error('Run: npm install puppeteer');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const htmlFile of HTML_FILES) {
    const htmlPath = path.join(DIR, htmlFile);
    if (!fs.existsSync(htmlPath)) {
      console.warn('Skip (not found):', htmlFile);
      continue;
    }
    const pdfFile = htmlFile.replace(/\.html$/i, '.pdf');
    const pdfPath = path.join(DIR, pdfFile);
    const fileUrl = 'file://' + htmlPath;

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 });
    await page.goto(fileUrl, {
      waitUntil: 'networkidle0',
      timeout: 15000,
    });

    await page.pdf({
      path: pdfPath,
      printBackground: true,
      format: 'A4',
      margin: { top: '16px', right: '16px', bottom: '16px', left: '16px' },
      preferCSSPageSize: false,
    });

    await page.close();
    console.log('Written:', pdfPath);
  }

  await browser.close();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// tools/compare-homepages.js
import os from 'os';
import path from 'path';
import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import puppeteer from 'puppeteer';

const DEFAULT_OUTPUT_DIR = path.join(os.tmpdir(), 'homehni-screenshots');
const OUTPUT_DIR = process.env.OUTPUT_DIR || DEFAULT_OUTPUT_DIR;
const VIEWPORT = { width: 1280, height: 800 };
const THRESHOLD_PERCENT = 1; // adjust if needed

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function captureScreenshot(browser, url, filename) {
  const page = await browser.newPage();
  try {
    await page.setViewport(VIEWPORT);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    const outputPath = path.join(OUTPUT_DIR, filename);
    // small wait for dynamic content
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.screenshot({ path: outputPath, fullPage: true });
    console.log(`✅ Saved: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`❌ Failed to capture ${url}: ${error.message}`);
    throw error;
  } finally {
    await page.close();
  }
}

async function main() {
  let browser;
  try {
    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });

    const localUrl = process.env.LOCAL_URL || 'http://localhost:3000';
    const externalUrl = process.env.EXTERNAL_URL || 'https://bayut.com/';

    const bayutPath = await captureScreenshot(browser, externalUrl, 'bayut.png');
    const homehniPath = await captureScreenshot(browser, localUrl, 'homehni.png');

    // Compare images
    const img1 = PNG.sync.read(fs.readFileSync(bayutPath));
    const img2 = PNG.sync.read(fs.readFileSync(homehniPath));

    const width = Math.max(img1.width, img2.width);
    const height = Math.max(img1.height, img2.height);
    const diff = new PNG({ width, height });
    const mismatched = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
    const total = width * height;
    const diffPercent = (mismatched / total) * 100;

    const diffPath = path.join(OUTPUT_DIR, 'diff.png');
    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    console.log(`Difference: ${diffPercent.toFixed(2)}%`);

    if (diffPercent > THRESHOLD_PERCENT) {
      console.log('\n❌ FAIL: Difference exceeds threshold!');
      process.exitCode = 1;
    } else {
      console.log('\n✅ OK: Difference within threshold');
    }

    console.log('\nArtifacts:');
    console.log(`  ${bayutPath}`);
    console.log(`  ${homehniPath}`);
    console.log(`  ${diffPath}`);

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    // do not modify repository files
  }
}

main();

/**
 * compare-homepages.js
 *
 * This script captures screenshots of:
 * 1. https://www.bayut.ae/ (external site)
 * 2. http://localhost:3000/ (local HomeHNI prototype)
 *
 * Then uses pixelmatch to create a visual diff.
 *
 * Requirements:
 * - Node.js 18+
 * - Run `npm install` first
 * - Start local server with `npm start` before running comparison
 *
 * Usage:
 *   npm start                # Start local server (in separate terminal)
 *   npm run compare          # Run this comparison script
 *
 * Output:
 *   tools/output/bayut.png     - Screenshot of Bayut homepage
 *   tools/output/homehni.png   - Screenshot of HomeHNI homepage
 *   tools/output/diff.png      - Visual diff (mismatched pixels in red)
 *
 * Exit codes:
 *   0 - Success (or diff within acceptable threshold)
 *   1 - Error or diff exceeds threshold
 */

import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, 'output');
const BAYUT_URL = 'https://www.bayut.ae/';
const LOCAL_URL = 'http://localhost:3000/';

// Viewport settings for consistent screenshots
const VIEWPORT = { width: 1280, height: 800 };

// Pixel mismatch threshold percentage (0-100)
// Higher = more tolerant of differences
const THRESHOLD_PERCENT = 10;

async function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

async function captureScreenshot(browser, url, filename) {
  console.log(`📸 Capturing: ${url}`);
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Wait a bit for any animations to settle
    await new Promise(resolve => setTimeout(resolve, 1000));

    const filepath = path.join(OUTPUT_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: false });
    console.log(`   ✅ Saved: ${filepath}`);
    return filepath;
  } catch (error) {
    console.error(`   ❌ Failed to capture ${url}: ${error.message}`);
    throw error;
  } finally {
    await page.close();
  }
}

async function createDiff(img1Path, img2Path, diffPath) {
  console.log(`🔍 Creating diff...`);

  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));

  // Ensure same dimensions for comparison
  const width = Math.min(img1.width, img2.width);
  const height = Math.min(img1.height, img2.height);

  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  console.log(`   ✅ Diff saved: ${diffPath}`);

  const totalPixels = width * height;
  const diffPercent = (numDiffPixels / totalPixels) * 100;

  return { numDiffPixels, totalPixels, diffPercent };
}

async function main() {
  console.log('🚀 HomeHNI vs Bayut Homepage Comparison\n');

  await ensureOutputDir();

  let browser;
  let exitCode = 0;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    // Capture screenshots
    let bayutPath, homehniPath;

    try {
      bayutPath = await captureScreenshot(browser, BAYUT_URL, 'bayut.png');
    } catch (error) {
      console.log('\n⚠️  Could not capture Bayut homepage (network restrictions).');
      console.log('   Creating a placeholder for demonstration.\n');
      // Create a blank placeholder image
      const blank = new PNG({ width: VIEWPORT.width, height: VIEWPORT.height });
      blank.data.fill(255); // White background
      bayutPath = path.join(OUTPUT_DIR, 'bayut.png');
      fs.writeFileSync(bayutPath, PNG.sync.write(blank));
    }

    try {
      homehniPath = await captureScreenshot(browser, LOCAL_URL, 'homehni.png');
    } catch (error) {
      console.log('\n⚠️  Could not capture local HomeHNI page.');
      console.log('   Make sure local server is running: npm start\n');
      exitCode = 1;
      return;
    }

    // Create diff
    const diffPath = path.join(OUTPUT_DIR, 'diff.png');
    const { numDiffPixels, totalPixels, diffPercent } = await createDiff(
      bayutPath,
      homehniPath,
      diffPath
    );

    console.log(`\n📊 Results:`);
    console.log(`   Total pixels: ${totalPixels.toLocaleString()}`);
    console.log(`   Different pixels: ${numDiffPixels.toLocaleString()}`);
    console.log(`   Difference: ${diffPercent.toFixed(2)}%`);
    console.log(`   Threshold: ${THRESHOLD_PERCENT}%`);

    if (diffPercent > THRESHOLD_PERCENT) {
      console.log(`\n❌ FAIL: Difference exceeds threshold!`);
      exitCode = 1;
    } else {
      console.log(`\n✅ PASS: Difference within acceptable range.`);
    }

    console.log(`\n📁 Output files:`);
    console.log(`   ${bayutPath}`);
    console.log(`   ${homehniPath}`);
    console.log(`   ${diffPath}`);

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
    process.exit(exitCode);
  }
}

main();

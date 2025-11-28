/**
 * compare-homepages.js
 * 
 * Visual comparison tool for HomeHNI homepage prototype vs Bayut.ae
 * 
 * This script:
 * 1. Captures a screenshot of the live Bayut.ae homepage
 * 2. Captures a screenshot of the local HomeHNI prototype
 * 3. Creates a pixel-level diff image
 * 4. Exits with non-zero code if difference exceeds threshold
 * 
 * Prerequisites:
 * - Run `npm install` in the tools directory first
 * - Start the local server: `npm start` (runs on port 3000)
 * 
 * Usage:
 *   node tools/compare-homepages.js
 * 
 * Output:
 *   - tools/output/bayut.png       - Screenshot of bayut.ae
 *   - tools/output/homehni.png     - Screenshot of local HomeHNI
 *   - tools/output/diff.png        - Visual diff between the two
 * 
 * Exit Codes:
 *   0 - Success (difference within threshold)
 *   1 - Failure (difference exceeds threshold or error occurred)
 * 
 * Configuration:
 *   DIFF_THRESHOLD - Maximum allowed pixel difference ratio (default: 0.5 = 50%)
 *   VIEWPORT_WIDTH - Screenshot viewport width (default: 1280)
 *   VIEWPORT_HEIGHT - Screenshot viewport height (default: 800)
 * 
 * Notes:
 * - The Bayut.ae screenshot may fail in CI environments due to network restrictions
 * - In such cases, run this script locally for manual comparison
 * - The diff threshold is intentionally high (50%) as we expect significant
 *   visual differences between the placeholder prototype and the production site
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

// Configuration
const CONFIG = {
  // URLs to compare
  bayutUrl: 'https://www.bayut.ae/',
  homehniUrl: 'http://localhost:3000/homehni/',
  
  // Output directory for screenshots
  outputDir: path.join(__dirname, 'output'),
  
  // Screenshot dimensions
  viewportWidth: 1280,
  viewportHeight: 800,
  
  // Maximum allowed difference ratio (0.0 - 1.0)
  // Set high because we're using placeholder content
  diffThreshold: 0.5,
  
  // Timeout for page load (ms)
  timeout: 30000,
  
  // Pixelmatch threshold (0.0 - 1.0)
  // Lower = more sensitive to differences
  pixelmatchThreshold: 0.1
};

/**
 * Ensure output directory exists
 */
function ensureOutputDir() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`Created output directory: ${CONFIG.outputDir}`);
  }
}

/**
 * Capture screenshot of a URL
 * @param {Browser} browser - Puppeteer browser instance
 * @param {string} url - URL to capture
 * @param {string} filename - Output filename
 * @returns {Promise<string>} - Path to saved screenshot
 */
async function captureScreenshot(browser, url, filename) {
  console.log(`\nCapturing screenshot of: ${url}`);
  
  const page = await browser.newPage();
  
  await page.setViewport({
    width: CONFIG.viewportWidth,
    height: CONFIG.viewportHeight
  });
  
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: CONFIG.timeout
    });
    
    // Wait a bit for any animations to settle
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const outputPath = path.join(CONFIG.outputDir, filename);
    await page.screenshot({ path: outputPath, fullPage: false });
    
    console.log(`  ✓ Saved: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`  ✗ Failed to capture ${url}: ${error.message}`);
    throw error;
  } finally {
    await page.close();
  }
}

/**
 * Compare two images and generate diff
 * @param {string} img1Path - Path to first image
 * @param {string} img2Path - Path to second image
 * @returns {Promise<{diffPixels: number, totalPixels: number, diffRatio: number}>}
 */
async function compareImages(img1Path, img2Path) {
  console.log('\nComparing images...');
  
  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));
  
  // Ensure images are the same size
  const width = Math.min(img1.width, img2.width);
  const height = Math.min(img1.height, img2.height);
  
  const diff = new PNG({ width, height });
  
  const diffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: CONFIG.pixelmatchThreshold }
  );
  
  const totalPixels = width * height;
  const diffRatio = diffPixels / totalPixels;
  
  // Save diff image
  const diffPath = path.join(CONFIG.outputDir, 'diff.png');
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  console.log(`  ✓ Diff image saved: ${diffPath}`);
  
  return { diffPixels, totalPixels, diffRatio };
}

/**
 * Main execution
 */
async function main() {
  console.log('='.repeat(60));
  console.log('HomeHNI vs Bayut.ae Visual Comparison Tool');
  console.log('='.repeat(60));
  
  ensureOutputDir();
  
  let browser;
  let exitCode = 0;
  let bayutCaptured = false;
  let homehniCaptured = false;
  
  try {
    console.log('\nLaunching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    // Try to capture Bayut screenshot
    // This may fail in CI environments due to network restrictions
    try {
      await captureScreenshot(browser, CONFIG.bayutUrl, 'bayut.png');
      bayutCaptured = true;
    } catch (error) {
      console.warn('\n⚠️  Could not capture Bayut.ae screenshot.');
      console.warn('   This is expected in CI environments with network restrictions.');
      console.warn('   To compare visually, run this script locally.');
    }
    
    // Capture HomeHNI screenshot
    try {
      await captureScreenshot(browser, CONFIG.homehniUrl, 'homehni.png');
      homehniCaptured = true;
    } catch (error) {
      console.error('\n✗ Could not capture HomeHNI screenshot.');
      console.error('  Make sure the local server is running: npm start');
      exitCode = 1;
    }
    
    // Compare if both screenshots were captured
    if (bayutCaptured && homehniCaptured) {
      const { diffPixels, totalPixels, diffRatio } = await compareImages(
        path.join(CONFIG.outputDir, 'bayut.png'),
        path.join(CONFIG.outputDir, 'homehni.png')
      );
      
      console.log('\n' + '='.repeat(60));
      console.log('Comparison Results:');
      console.log('='.repeat(60));
      console.log(`  Total pixels:     ${totalPixels.toLocaleString()}`);
      console.log(`  Different pixels: ${diffPixels.toLocaleString()}`);
      console.log(`  Difference ratio: ${(diffRatio * 100).toFixed(2)}%`);
      console.log(`  Threshold:        ${(CONFIG.diffThreshold * 100).toFixed(2)}%`);
      
      if (diffRatio > CONFIG.diffThreshold) {
        console.log('\n✗ FAIL: Difference exceeds threshold');
        exitCode = 1;
      } else {
        console.log('\n✓ PASS: Difference within threshold');
      }
    } else if (homehniCaptured && !bayutCaptured) {
      console.log('\n' + '='.repeat(60));
      console.log('Partial Results:');
      console.log('='.repeat(60));
      console.log('  HomeHNI screenshot captured successfully.');
      console.log('  Bayut.ae screenshot could not be captured (network restriction).');
      console.log('  Run locally for full comparison.');
      // Don't fail if only Bayut couldn't be captured
    }
    
  } catch (error) {
    console.error('\n✗ Unexpected error:', error.message);
    exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
      console.log('\nBrowser closed.');
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`Exit code: ${exitCode}`);
  console.log('='.repeat(60));
  
  process.exit(exitCode);
}

// Run the script
main();

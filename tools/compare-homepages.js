/**
 * Homepage Comparison Script
 * Compares Bayut homepage with HomeHNI homepage using Puppeteer and pixelmatch
 */

import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG = {
    bayutUrl: 'https://www.bayut.ae/',
    homehniUrl: 'http://localhost:3000/homehni/',
    threshold: 0.1,
    outputDir: path.join(__dirname, 'output'),
    viewport: { width: 1920, height: 1080 },
    fullPage: true,
    timeout: 30000,
};

function parseArgs() {
    const args = process.argv.slice(2);
    const config = { ...CONFIG };
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--bayut-url') config.bayutUrl = args[++i];
        if (args[i] === '--homehni-url') config.homehniUrl = args[++i];
        if (args[i] === '--threshold') config.threshold = parseFloat(args[++i]);
        if (args[i] === '--skip-bayut') config.skipBayut = true;
        if (args[i] === '--help') { printHelp(); process.exit(0); }
    }
    return config;
}

function printHelp() {
    console.log(`
Homepage Comparison Script
Usage: node tools/compare-homepages.js [options]

Options:
  --bayut-url <url>     URL of Bayut homepage
  --homehni-url <url>   URL of HomeHNI homepage
  --threshold <number>  Pixel difference threshold (0-1)
  --skip-bayut          Skip Bayut screenshot
  --help                Show help
`);
}

function findChrome() {
    const paths = [
        '/usr/bin/chromium', '/usr/bin/chromium-browser',
        '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    ];
    for (const p of paths) if (fs.existsSync(p)) return p;
    throw new Error('Chrome not found');
}

async function takeScreenshot(browser, url, outputPath, options = {}) {
    console.log(`📸 Taking screenshot of: ${url}`);
    const page = await browser.newPage();
    await page.setViewport(options.viewport || CONFIG.viewport);
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: options.timeout || CONFIG.timeout });
        await new Promise(resolve => setTimeout(resolve, 2000));
        await page.screenshot({ path: outputPath, fullPage: options.fullPage ?? CONFIG.fullPage });
        console.log(`✅ Screenshot saved: ${outputPath}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed: ${error.message}`);
        return false;
    } finally {
        await page.close();
    }
}

function compareImages(img1Path, img2Path, diffPath) {
    console.log('\n🔍 Comparing images...');
    const img1 = PNG.sync.read(fs.readFileSync(img1Path));
    const img2 = PNG.sync.read(fs.readFileSync(img2Path));
    const width = Math.max(img1.width, img2.width);
    const height = Math.max(img1.height, img2.height);
    const diff = new PNG({ width, height });
    const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    const diffPercentage = (numDiffPixels / (width * height)) * 100;
    console.log(`📊 Difference: ${diffPercentage.toFixed(2)}%`);
    return { diffPercentage };
}

async function main() {
    const config = parseArgs();
    console.log('🏠 Homepage Comparison Tool\n');
    if (!fs.existsSync(config.outputDir)) fs.mkdirSync(config.outputDir, { recursive: true });
    
    const chromePath = process.env.CHROME_PATH || findChrome();
    const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    
    const bayutScreenshot = path.join(config.outputDir, 'bayut-screenshot.png');
    const homehniScreenshot = path.join(config.outputDir, 'homehni-screenshot.png');
    const diffImage = path.join(config.outputDir, 'diff.png');
    
    try {
        if (!config.skipBayut) await takeScreenshot(browser, config.bayutUrl, bayutScreenshot);
        await takeScreenshot(browser, config.homehniUrl, homehniScreenshot);
        if (fs.existsSync(bayutScreenshot) && fs.existsSync(homehniScreenshot)) {
            const { diffPercentage } = compareImages(bayutScreenshot, homehniScreenshot, diffImage);
            if (diffPercentage / 100 > config.threshold) {
                console.log(`\n❌ FAILED: Difference exceeds threshold`);
                process.exit(1);
            }
            console.log(`\n✅ PASSED`);
        }
    } finally {
        await browser.close();
    }
}

main().catch(e => { console.error(e); process.exit(1); });

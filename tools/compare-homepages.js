/**
 * Homepage Comparison Script
 * 
 * This script compares the Bayut homepage with the HomeHNI homepage
 * using Puppeteer for screenshots and pixelmatch for pixel comparison.
 * 
 * Usage:
 *   node tools/compare-homepages.js [options]
 * 
 * Options:
 *   --bayut-url <url>     URL of Bayut homepage (default: https://www.bayut.ae/)
 *   --homehni-url <url>   URL of HomeHNI homepage (default: http://localhost:3000/homehni/)
 *   --threshold <number>  Pixel difference threshold (0-1, default: 0.1)
 *   --skip-bayut          Skip Bayut screenshot (use existing)
 *   --help                Show help
 * 
 * Output:
 *   - tools/output/bayut-screenshot.png
 *   - tools/output/homehni-screenshot.png
 *   - tools/output/diff.png
 *   - tools/output/comparison-report.json
 * 
 * Exit codes:
 *   0 - Success, difference below threshold
 *   1 - Difference above threshold or error
 */

import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration defaults
const CONFIG = {
    bayutUrl: 'https://www.bayut.ae/',
    homehniUrl: 'http://localhost:3000/homehni/',
    threshold: 0.1, // 10% difference threshold
    outputDir: path.join(__dirname, 'output'),
    viewport: { width: 1920, height: 1080 },
    fullPage: true,
    timeout: 30000,
};

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const config = { ...CONFIG };
    
    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--bayut-url':
                config.bayutUrl = args[++i];
                break;
            case '--homehni-url':
                config.homehniUrl = args[++i];
                break;
            case '--threshold':
                config.threshold = parseFloat(args[++i]);
                break;
            case '--skip-bayut':
                config.skipBayut = true;
                break;
            case '--help':
                printHelp();
                process.exit(0);
            default:
                console.warn(`Unknown argument: ${args[i]}`);
        }
    }
    
    return config;
}

function printHelp() {
    console.log(`
Homepage Comparison Script

Compares the Bayut homepage with the HomeHNI homepage using visual regression testing.

Usage:
  node tools/compare-homepages.js [options]

Options:
  --bayut-url <url>     URL of Bayut homepage (default: ${CONFIG.bayutUrl})
  --homehni-url <url>   URL of HomeHNI homepage (default: ${CONFIG.homehniUrl})
  --threshold <number>  Pixel difference threshold (0-1, default: ${CONFIG.threshold})
  --skip-bayut          Skip Bayut screenshot (use existing file)
  --help                Show this help message

Output Files:
  tools/output/bayut-screenshot.png    - Screenshot of Bayut homepage
  tools/output/homehni-screenshot.png  - Screenshot of HomeHNI homepage
  tools/output/diff.png                - Visual diff highlighting differences
  tools/output/comparison-report.json  - JSON report with comparison metrics

Exit Codes:
  0 - Success: pixel difference is below threshold
  1 - Failure: pixel difference exceeds threshold or error occurred
`);
}

// Find Chrome executable
function findChrome() {
    const possiblePaths = [
        // Linux
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        // macOS
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        // Windows
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    ];
    
    for (const chromePath of possiblePaths) {
        if (fs.existsSync(chromePath)) {
            return chromePath;
        }
    }
    
    throw new Error('Chrome/Chromium not found. Please install Chrome or set CHROME_PATH environment variable.');
}

// Take screenshot of a URL
async function takeScreenshot(browser, url, outputPath, options = {}) {
    console.log(`📸 Taking screenshot of: ${url}`);
    
    const page = await browser.newPage();
    await page.setViewport(options.viewport || CONFIG.viewport);
    
    try {
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: options.timeout || CONFIG.timeout,
        });
        
        // Wait for content to fully load
        await page.waitForTimeout(2000);
        
        // Take screenshot
        await page.screenshot({
            path: outputPath,
            fullPage: options.fullPage ?? CONFIG.fullPage,
        });
        
        console.log(`✅ Screenshot saved: ${outputPath}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to screenshot ${url}: ${error.message}`);
        return false;
    } finally {
        await page.close();
    }
}

// Compare two images using pixelmatch
function compareImages(img1Path, img2Path, diffPath) {
    console.log('\n🔍 Comparing images...');
    
    // Read images
    const img1Data = fs.readFileSync(img1Path);
    const img2Data = fs.readFileSync(img2Path);
    
    const img1 = PNG.sync.read(img1Data);
    const img2 = PNG.sync.read(img2Data);
    
    // Ensure same dimensions (resize to max dimensions)
    const width = Math.max(img1.width, img2.width);
    const height = Math.max(img1.height, img2.height);
    
    // Create padded images if sizes differ
    const padImage = (img, targetWidth, targetHeight) => {
        if (img.width === targetWidth && img.height === targetHeight) {
            return img.data;
        }
        
        const padded = new PNG({ width: targetWidth, height: targetHeight });
        // Fill with white background
        for (let i = 0; i < padded.data.length; i += 4) {
            padded.data[i] = 255;     // R
            padded.data[i + 1] = 255; // G
            padded.data[i + 2] = 255; // B
            padded.data[i + 3] = 255; // A
        }
        
        // Copy original image
        for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
                const srcIdx = (img.width * y + x) << 2;
                const dstIdx = (targetWidth * y + x) << 2;
                padded.data[dstIdx] = img.data[srcIdx];
                padded.data[dstIdx + 1] = img.data[srcIdx + 1];
                padded.data[dstIdx + 2] = img.data[srcIdx + 2];
                padded.data[dstIdx + 3] = img.data[srcIdx + 3];
            }
        }
        
        return padded.data;
    };
    
    const img1Padded = padImage(img1, width, height);
    const img2Padded = padImage(img2, width, height);
    
    // Create diff image
    const diff = new PNG({ width, height });
    
    // Compare pixels
    const numDiffPixels = pixelmatch(
        img1Padded,
        img2Padded,
        diff.data,
        width,
        height,
        {
            threshold: 0.1,
            includeAA: true,
            alpha: 0.1,
        }
    );
    
    // Write diff image
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    
    const totalPixels = width * height;
    const diffPercentage = (numDiffPixels / totalPixels) * 100;
    
    console.log(`📊 Comparison Results:`);
    console.log(`   - Total pixels: ${totalPixels.toLocaleString()}`);
    console.log(`   - Different pixels: ${numDiffPixels.toLocaleString()}`);
    console.log(`   - Difference: ${diffPercentage.toFixed(2)}%`);
    console.log(`   - Diff image saved: ${diffPath}`);
    
    return {
        totalPixels,
        diffPixels: numDiffPixels,
        diffPercentage,
        width,
        height,
    };
}

// Main function
async function main() {
    const config = parseArgs();
    
    console.log('🏠 Homepage Comparison Tool\n');
    console.log('Configuration:');
    console.log(`  Bayut URL: ${config.bayutUrl}`);
    console.log(`  HomeHNI URL: ${config.homehniUrl}`);
    console.log(`  Threshold: ${config.threshold * 100}%`);
    console.log(`  Output: ${config.outputDir}\n`);
    
    // Ensure output directory exists
    if (!fs.existsSync(config.outputDir)) {
        fs.mkdirSync(config.outputDir, { recursive: true });
    }
    
    const chromePath = process.env.CHROME_PATH || findChrome();
    console.log(`🌐 Using Chrome: ${chromePath}\n`);
    
    // Launch browser
    const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
        ],
    });
    
    const bayutScreenshot = path.join(config.outputDir, 'bayut-screenshot.png');
    const homehniScreenshot = path.join(config.outputDir, 'homehni-screenshot.png');
    const diffImage = path.join(config.outputDir, 'diff.png');
    const reportPath = path.join(config.outputDir, 'comparison-report.json');
    
    try {
        // Take Bayut screenshot (unless skipped)
        let bayutSuccess = true;
        if (!config.skipBayut) {
            bayutSuccess = await takeScreenshot(browser, config.bayutUrl, bayutScreenshot);
            
            if (!bayutSuccess) {
                console.warn('\n⚠️ Could not capture Bayut screenshot.');
                console.warn('   This may be due to network restrictions.');
                console.warn('   Using placeholder or existing screenshot if available.\n');
                
                // Check if placeholder exists
                const placeholderPath = path.join(__dirname, '..', 'assets', 'bayut-homepage.png');
                if (fs.existsSync(placeholderPath)) {
                    fs.copyFileSync(placeholderPath, bayutScreenshot);
                    console.log(`   Copied placeholder: ${placeholderPath}`);
                    bayutSuccess = true;
                }
            }
        } else if (fs.existsSync(bayutScreenshot)) {
            console.log(`📸 Using existing Bayut screenshot: ${bayutScreenshot}`);
        } else {
            console.error('❌ No existing Bayut screenshot found and --skip-bayut was specified.');
            process.exit(1);
        }
        
        // Take HomeHNI screenshot
        const homehniSuccess = await takeScreenshot(browser, config.homehniUrl, homehniScreenshot);
        
        if (!homehniSuccess) {
            console.error('\n❌ Failed to capture HomeHNI screenshot.');
            console.error('   Make sure the HomeHNI server is running at:', config.homehniUrl);
            process.exit(1);
        }
        
        // Compare screenshots
        if (fs.existsSync(bayutScreenshot) && fs.existsSync(homehniScreenshot)) {
            const results = compareImages(bayutScreenshot, homehniScreenshot, diffImage);
            
            // Generate report
            const report = {
                timestamp: new Date().toISOString(),
                config: {
                    bayutUrl: config.bayutUrl,
                    homehniUrl: config.homehniUrl,
                    threshold: config.threshold,
                },
                results: {
                    ...results,
                    passed: results.diffPercentage / 100 <= config.threshold,
                },
                files: {
                    bayutScreenshot,
                    homehniScreenshot,
                    diffImage,
                },
            };
            
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            console.log(`\n📄 Report saved: ${reportPath}`);
            
            // Check threshold
            const diffRatio = results.diffPercentage / 100;
            if (diffRatio > config.threshold) {
                console.log(`\n❌ FAILED: Pixel difference (${results.diffPercentage.toFixed(2)}%) exceeds threshold (${config.threshold * 100}%)`);
                process.exit(1);
            } else {
                console.log(`\n✅ PASSED: Pixel difference (${results.diffPercentage.toFixed(2)}%) is within threshold (${config.threshold * 100}%)`);
                process.exit(0);
            }
        } else {
            console.error('\n❌ Cannot compare: one or more screenshots missing.');
            process.exit(1);
        }
    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

// Run main function
main().catch(error => {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
});

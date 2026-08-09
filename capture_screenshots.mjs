import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\drzah\\.gemini\\antigravity\\brain\\ea66a76a-ce3f-4169-9485-8309d2f18202';
const SITE_URL = 'https://voltcast-sokoto.vercel.app/';
const CHROME_PATH = 'C:\\Users\\drzah\\.cache\\puppeteer\\chrome-headless-shell\\win64-151.0.7922.71\\chrome-headless-shell-win64\\chrome-headless-shell.exe';

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching Headless Chrome Shell from:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    }
  });

  const page = await browser.newPage();
  console.log(`Navigating to ${SITE_URL}...`);
  await page.goto(SITE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 3000)));

  // Helper to click sidebar nav tab
  const clickTab = async (tabText) => {
    const buttons = await page.$$('button, div');
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent, button);
      if (text && text.includes(tabText)) {
        await button.click();
        await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 2000)));
        return true;
      }
    }
    return false;
  };

  // 1. Main Dashboard Command Center
  console.log('Capturing 01_main_dashboard.png...');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '01_main_dashboard.png'), fullPage: false });

  // 2. Interactive GIS Map View
  console.log('Capturing 02_gis_map_view.png...');
  await clickTab('GIS Map View');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '02_gis_map_view.png'), fullPage: false });

  // 3. Outage Predictor
  console.log('Capturing 03_outage_predictor.png...');
  await clickTab('Outage Predictor');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '03_outage_predictor.png'), fullPage: false });

  // 4. District Heatmap
  console.log('Capturing 04_district_heatmap.png...');
  await clickTab('District Heatmap');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '04_district_heatmap.png'), fullPage: false });

  // 5. Data Uploader
  console.log('Capturing 05_data_uploader.png...');
  await clickTab('Upload Data');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '05_data_uploader.png'), fullPage: false });

  // 6. OpenRouter AI Assistant
  console.log('Capturing 06_openrouter_ai_assistant.png...');
  await clickTab('AI Copilot');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_openrouter_ai_assistant.png'), fullPage: false });

  // 7. Model Evaluation
  console.log('Capturing 07_model_evaluation.png...');
  await clickTab('Model Evaluation');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_model_evaluation.png'), fullPage: false });

  // 8. Incident Logs
  console.log('Capturing 08_incident_logs.png...');
  await clickTab('Incident Logs');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '08_incident_logs.png'), fullPage: false });

  console.log('SUCCESS: All screenshots saved to artifact directory!');
  await browser.close();
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});

import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF(htmlPath, pdfPath) {
  console.log(`Generating PDF from ${htmlPath}...`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Read HTML file
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // Set content
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0'
  });
  
  // Generate PDF
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm'
    }
  });
  
  await browser.close();
  console.log(`✓ Generated: ${pdfPath}`);
}

async function generateAllPDFs() {
  const publicDir = path.join(__dirname, '..', 'public');
  const caseStudiesDir = path.join(publicDir, 'case-studies');
  
  const pdfs = [
    {
      html: path.join(caseStudiesDir, 'resume-screener-rag.html'),
      pdf: path.join(caseStudiesDir, 'resume-screener-rag.pdf')
    },
    {
      html: path.join(caseStudiesDir, 'workflow-automation.html'),
      pdf: path.join(caseStudiesDir, 'workflow-automation.pdf')
    },
    {
      html: path.join(caseStudiesDir, 'document-qa-rag.html'),
      pdf: path.join(caseStudiesDir, 'document-qa-rag.pdf')
    },
    {
      html: path.join(publicDir, 'pricing-guide.html'),
      pdf: path.join(publicDir, 'pricing-guide.pdf')
    }
  ];
  
  console.log('Starting PDF generation...\n');
  
  for (const { html, pdf } of pdfs) {
    try {
      if (fs.existsSync(html)) {
        await generatePDF(html, pdf);
      } else {
        console.log(`⚠ HTML file not found: ${html}`);
      }
    } catch (error) {
      console.error(`✗ Error generating ${pdf}:`, error.message);
    }
  }
  
  console.log('\nPDF generation complete!');
}

// Run if called directly
generateAllPDFs().catch(console.error);

export { generateAllPDFs, generatePDF };


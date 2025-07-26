const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors());
app.use(express.json());

// Generate flashcards from website content
app.post('/generate_flashcards_from_website', async (req, res) => {
  const { url, subject, topic, count = 5 } = req.body;
  
  if (!url || !subject || !topic) {
    return res.status(400).json({
      error: "url, subject, and topic parameters are required"
    });
  }
  
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url);
    
    const content = await page.evaluate(() => document.body.innerText);
    await browser.close();
    
    // Generate flashcards JSON structure
    const flashcards = {
      subject,
      topic,
      source: url,
      cards: generateCardsFromContent(content, count)
    };
    
    // Save to content directory
    const contentDir = path.join(__dirname, '..', 'server', 'content', subject);
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    
    const filePath = path.join(contentDir, `${topic}.json`);
    fs.writeFileSync(filePath, JSON.stringify(flashcards, null, 2));
    
    res.json({ success: true, flashcards, filePath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate flashcards from PDF
app.post('/generate_flashcards_from_pdf', async (req, res) => {
  const { filePath, subject, topic, count = 5 } = req.body;
  
  if (!filePath || !subject || !topic) {
    return res.status(400).json({
      error: "filePath, subject, and topic parameters are required"
    });
  }
  
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    
    const flashcards = {
      subject,
      topic,
      source: filePath,
      cards: generateCardsFromContent(pdfData.text, count)
    };
    
    const contentDir = path.join(__dirname, '..', 'server', 'content', subject);
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    
    const outputPath = path.join(contentDir, `${topic}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(flashcards, null, 2));
    
    res.json({ success: true, flashcards, filePath: outputPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simple flashcard generation logic (to be enhanced with AI)
function generateCardsFromContent(content, count) {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const cards = [];
  
  for (let i = 0; i < Math.min(count, sentences.length); i++) {
    const sentence = sentences[i].trim();
    cards.push({
      id: i + 1,
      question: `What is: ${sentence.substring(0, 50)}...?`,
      answer: sentence
    });
  }
  
  return cards;
}

// MCP discovery endpoint
app.get('/', (req, res) => {
  res.json({
    name: "flashcards-mcp",
    version: "1.0.0",
    capabilities: [
      {
        name: "generate_flashcards_from_website",
        description: "Generate flashcards from website content",
        parameters: {
          type: "object",
          properties: {
            url: { type: "string", description: "Website URL" },
            subject: { type: "string", description: "Subject category" },
            topic: { type: "string", description: "Topic name" },
            count: { type: "number", description: "Number of cards to generate" }
          },
          required: ["url", "subject", "topic"]
        }
      },
      {
        name: "generate_flashcards_from_pdf",
        description: "Generate flashcards from PDF content",
        parameters: {
          type: "object",
          properties: {
            filePath: { type: "string", description: "Path to PDF file" },
            subject: { type: "string", description: "Subject category" },
            topic: { type: "string", description: "Topic name" },
            count: { type: "number", description: "Number of cards to generate" }
          },
          required: ["filePath", "subject", "topic"]
        }
      }
    ]
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Flashcards MCP server running on port ${PORT}`);
});
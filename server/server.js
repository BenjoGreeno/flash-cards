const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve static files (React build)
app.use(express.static(path.join(__dirname, 'public')));

// Get all subjects
app.get('/api/subjects', (req, res) => {
  const contentDir = path.join(__dirname, 'content');
  const subjects = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  res.json(subjects);
});

// Get topics for a subject
app.get('/api/subjects/:subject', (req, res) => {
  const { subject } = req.params;
  const subjectDir = path.join(__dirname, 'content', subject);
  
  if (!fs.existsSync(subjectDir)) {
    return res.status(404).json({ error: 'Subject not found' });
  }
  
  const topics = fs.readdirSync(subjectDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
  res.json(topics);
});

// Get cards for a specific topic or all topics
app.get('/api/cards/:subject/:topic', (req, res) => {
  const { subject, topic } = req.params;
  const subjectDir = path.join(__dirname, 'content', subject);
  
  if (!fs.existsSync(subjectDir)) {
    return res.status(404).json({ error: 'Subject not found' });
  }
  
  if (topic === 'all') {
    // Combine all topics for this subject
    const files = fs.readdirSync(subjectDir).filter(file => file.endsWith('.json'));
    let allCards = [];
    let cardId = 1;
    let combinedMetadata = { sources: [], lastUpdated: null };
    
    files.forEach(file => {
      const filePath = path.join(subjectDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const cardsWithNewIds = data.cards.map(card => ({ ...card, id: cardId++ }));
      allCards = allCards.concat(cardsWithNewIds);
      
      // Combine metadata
      if (data.metadata) {
        if (data.metadata.sources) {
          combinedMetadata.sources = combinedMetadata.sources.concat(data.metadata.sources);
        }
        if (!combinedMetadata.lastUpdated || data.metadata.lastUpdated > combinedMetadata.lastUpdated) {
          combinedMetadata.lastUpdated = data.metadata.lastUpdated;
        }
      }
    });
    
    // Remove duplicate sources
    combinedMetadata.sources = [...new Set(combinedMetadata.sources)];
    
    return res.json({ cards: allCards, metadata: combinedMetadata });
  }
  
  // Single topic
  const filePath = path.join(subjectDir, `${topic}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.json({ cards: data.cards, metadata: data.metadata });
});

// Legacy endpoint for backwards compatibility
app.get('/api/cards', (req, res) => {
  const filePath = path.join(__dirname, 'content', 'javascript', 'basics.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  res.json(data.cards);
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample API route
app.get('/api/cards', (req, res) => {
  res.json([
    { id: 1, question: 'What is React?', answer: 'A JavaScript library for building user interfaces' },
    { id: 2, question: 'What is Node.js?', answer: 'A JavaScript runtime built on Chrome\'s V8 engine' }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
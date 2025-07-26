# Usage Guide

## Scenario 1: Manual Flashcard Creation

Perfect for users who want to create flashcards without AI tools.

### Step-by-Step

1. **Navigate to content directory:**
```bash
cd server/content
```

2. **Create your subject folder:**
```bash
mkdir my-study-topic
```

3. **Create a topic file:**
```bash
touch my-study-topic/chapter-1.json
```

4. **Add your flashcards:**
```json
{
  "subject": "my-study-topic",
  "topic": "chapter-1",
  "cards": [
    {
      "id": 1,
      "question": "What is the capital of France?",
      "answer": "Paris"
    },
    {
      "id": 2,
      "question": "What year did World War II end?",
      "answer": "1945"
    }
  ]
}
```

5. **Restart the app** (if running) to see your new flashcards

### Tips for Manual Creation

- **Keep questions concise** - Aim for 1-2 sentences
- **Make answers specific** - Avoid vague responses
- **Use consistent ID numbering** - Start from 1 for each topic
- **Group related concepts** - Use topics to organize subtopics

## Scenario 2: AI-Powered Generation

Use the MCP server with AI tools to automatically generate flashcards.

### Prerequisites

1. **Install MCP server:**
```bash
cd mcp-server
npm install
npx playwright install
```

2. **Start MCP server:**
```bash
npm start
```

### Using with AI Assistants

#### With Amazon Q (or similar AI tools)

1. **Point your AI to the MCP server:** `http://localhost:3001`

2. **Ask your AI to generate flashcards:**
   - "Generate flashcards from this PDF about machine learning"
   - "Create study cards from this website about React hooks"
   - "Make flashcards covering the first 3 chapters of this document"

#### Manual API Calls

**From a website:**
```bash
curl -X POST http://localhost:3001/generate_flashcards_from_website \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    "subject": "javascript",
    "topic": "mdn-guide",
    "count": 12
  }'
```

**From a PDF:**
```bash
curl -X POST http://localhost:3001/generate_flashcards_from_pdf \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "/Users/yourname/Documents/textbook.pdf",
    "subject": "biology",
    "topic": "cell-structure",
    "count": 20
  }'
```

### Best Practices for AI Generation

- **Use descriptive subject/topic names** - Makes organization easier
- **Specify appropriate count** - 5-15 cards per topic works well
- **Review generated content** - AI isn't perfect, edit as needed
- **Use quality sources** - Better input = better flashcards

## Content Organization Tips

### Subject Naming
- Use lowercase with hyphens: `machine-learning`, `spanish-vocab`
- Be specific: `aws-solutions-architect` not just `aws`
- Group related topics: `calculus-derivatives`, `calculus-integrals`

### Topic Naming
- Keep it short: `basics`, `advanced`, `chapter-1`
- Use consistent patterns within subjects
- Avoid special characters and spaces

### File Structure Example
```
server/content/
├── aws-certifications/
│   ├── solutions-architect.json
│   ├── developer.json
│   └── sysops.json
├── spanish/
│   ├── vocabulary.json
│   ├── grammar.json
│   └── conjugations.json
└── programming/
    ├── javascript-basics.json
    ├── react-hooks.json
    └── node-apis.json
```

## Troubleshooting

### Common Issues

**Cards not appearing:**
- Check JSON syntax with a validator
- Ensure file is in correct directory
- Restart the app after adding new files

**MCP server not working:**
- Verify Playwright is installed: `npx playwright install`
- Check port 3001 isn't in use
- Look for error messages in terminal

**Port conflicts:**
- Main app: 3002 (React), 5000 (API)
- MCP server: 3001
- Adjust ports in .env files if needed
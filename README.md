# Flash Cards Web App

A simple Node.js & React flash cards application with AI-powered content generation.

## Quick Start

1. **Install dependencies:**
```bash
npm run install-all
```

2. **Start the app:**
```bash
npm run dev
```

This starts:
- Backend API: http://localhost:5000
- React app: http://localhost:3002

## Usage Options

### Option 1: Manual Flashcard Creation (No AI Required)

Create flashcards by adding JSON files to the content structure:

1. **Create subject folder:**
```bash
mkdir server/content/your-subject
```

2. **Add topic JSON file:**
```json
{
  "subject": "your-subject",
  "topic": "topic-name",
  "cards": [
    {
      "id": 1,
      "question": "Your question here?",
      "answer": "Your answer here"
    }
  ]
}
```

3. **Save as:** `server/content/your-subject/topic-name.json`

4. **Refresh the app** - your new subject/topic will appear automatically!

### Option 2: AI-Powered Content Generation

Use the MCP server to generate flashcards from PDFs and websites:

#### Setup MCP Server

1. **Install MCP dependencies:**
```bash
cd mcp-server
npm install
npx playwright install
```

2. **Start MCP server:**
```bash
npm start
```

MCP server runs on http://localhost:3001

#### Generate from Website

```bash
curl -X POST http://localhost:3001/generate_flashcards_from_website \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/tutorial",
    "subject": "programming",
    "topic": "basics",
    "count": 10
  }'
```

#### Generate from PDF

```bash
curl -X POST http://localhost:3001/generate_flashcards_from_pdf \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "/path/to/your/document.pdf",
    "subject": "study-material",
    "topic": "chapter-1",
    "count": 15
  }'
```

#### Use with AI Tools (Claude, ChatGPT, etc.)

The MCP server is compatible with AI assistants. Point your AI tool to:
- **MCP Server:** http://localhost:3001
- **Available endpoints:** `/generate_flashcards_from_website`, `/generate_flashcards_from_pdf`

## Content Structure

```
server/content/
├── subject-name/
│   ├── topic-1.json
│   ├── topic-2.json
│   └── topic-3.json
└── another-subject/
    └── topic.json
```

## Features

- 🃏 **Flippable cards** - Click to reveal answers
- 📚 **Subject organization** - Group topics by subject
- 🔄 **"All Topics"** - Study entire subjects at once
- 🤖 **AI generation** - Create cards from any content
- 📱 **Responsive design** - Works on all devices

## Port Configuration

- **5000**: Flash cards API
- **3001**: MCP server (if using AI features)
- **3002**: React frontend

## Contributing

Fork this repo and add your own flashcard subjects! Perfect for:
- Exam preparation
- Language learning
- Technical documentation
- Training materials

## Examples

See `server/content/` for example flashcard formats covering JavaScript, React, and AWS topics.
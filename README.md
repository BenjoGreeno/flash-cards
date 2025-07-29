# Flash Cards Web App

A simple Node.js & React flash cards application with AI-powered content generation.

## Quick Start

### Option 1: Docker (Recommended)

**Prerequisites:** Docker and Docker Compose

1. **Clone and start:**
```bash
git clone https://github.com/BenjoGreeno/flash-cards.git
cd flash-cards
docker-compose up
```

2. **Open:** http://localhost:3002

**With MCP server (for AI features):**
```bash
./mcp-setup.sh
```
Then restart VS Code. See [MCP-SETUP.md](MCP-SETUP.md) for other AI tools.

### Option 2: Local Development

**Prerequisites:** Node.js (v16 or higher), npm

1. **Clone the repository:**
```bash
git clone https://github.com/BenjoGreeno/flash-cards.git
cd flash-cards
```

2. **Install dependencies:**
```bash
npm run install-all
```

3. **Start the app:**
```bash
npm run dev
```

This starts:
- Backend API: http://localhost:5000
- React app: http://localhost:3002

**That's it!** Open http://localhost:3002 in your browser to start studying.

## Usage Options

### Option 1: Manual Flashcard Creation (No AI Required)

Create flashcards by adding JSON files to the content structure:

1. **Create subject folder:**

**Docker:**
```bash
docker-compose exec api mkdir -p /app/content/your-subject
```

**Local:**
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

**With Docker:**
```bash
docker-compose --profile mcp up
```

**Local development:**
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

## Troubleshooting

### Docker Issues

**Port conflicts:**
- Change ports in `docker-compose.yml` if 3002 or 5000 are in use
- Stop other services: `docker-compose down`

**Build issues:**
- Rebuild containers: `docker-compose up --build`
- Clear Docker cache: `docker system prune`

**Container not starting:**
- Check logs: `docker-compose logs [service-name]`
- Verify Docker and Docker Compose are installed

### Local Development Issues

**Port conflicts:**
- If port 3002 is in use, create `client/.env` with `PORT=3003`
- If port 5000 is in use, update `server/server.js` port setting

**Dependencies issues:**
- Delete `node_modules` folders and run `npm run install-all` again
- Ensure Node.js version is 16 or higher: `node --version`

**App not loading:**
- Check both servers are running (you should see output from both)
- Verify http://localhost:5000/api/subjects returns JSON
- Check browser console for errors

## Contributing

Fork this repo and add your own flashcard subjects! Perfect for:
- Exam preparation
- Language learning
- Technical documentation
- Training materials

## Examples

See `server/content/` for example flashcard formats covering JavaScript, React, System Design, and AWS topics.
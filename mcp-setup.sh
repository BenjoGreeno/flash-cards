#!/bin/bash

# Self-contained MCP setup script for Amazon Q PDF/Website ingestion
# Usage: ./mcp-setup.sh

PROJECT_DIR="$(pwd)"
MCP_SERVER_PATH="$PROJECT_DIR/.amazonq/mcp-server.js"

if [ -f ".gitignore" ]; then
    if ! grep -q "^.amazonq$" .gitignore; then
        echo ".amazonq" >> .gitignore
    fi
else
    echo ".amazonq" > .gitignore
fi

# Create .amazonq directory
mkdir -p "$PROJECT_DIR/.amazonq"

# Create embedded MCP server
cat > "$MCP_SERVER_PATH" << 'EOF'
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const server = new Server(
  {
    name: 'flashcards-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'ingest_pdf',
        description: 'Extract content from PDF files',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Absolute path to the PDF file',
            },
            pages: {
              type: 'number',
              description: 'Number of pages to read (optional)',
            },
          },
          required: ['filePath'],
        },
      },
      {
        name: 'ingest_website',
        description: 'Extract content from websites using Playwright',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL of the website to scrape',
            },
          },
          required: ['url'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'ingest_pdf': {
      const { filePath, pages } = args;
      
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }
      
      const dataBuffer = fs.readFileSync(filePath);
      const options = pages ? { max: parseInt(pages) } : {};
      const pdfData = await pdfParse(dataBuffer, options);
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              title: path.basename(filePath),
              pageCount: pdfData.numpages,
              pagesRead: pages ? Math.min(parseInt(pages), pdfData.numpages) : pdfData.numpages,
              content: pdfData.text,
            }),
          },
        ],
      };
    }

    case 'ingest_website': {
      const { url } = args;
      
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();
      
      await page.goto(url);
      const title = await page.title();
      const text = await page.evaluate(() => document.body.innerText);
      
      await browser.close();
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              title,
              url,
              content: text.substring(0, 10000),
            }),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Flashcards server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
EOF

# Make server executable
chmod +x "$MCP_SERVER_PATH"

# Create package.json for dependencies
cat > "$PROJECT_DIR/.amazonq/package.json" << 'EOF'
{
  "name": "flashcards-mcp",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.4.0",
    "playwright": "^1.40.0",
    "pdf-parse": "^1.1.1"
  }
}
EOF

# Create MCP configuration
cat > "$PROJECT_DIR/.amazonq/mcp.json" << EOF
{
  "mcpServers": {
    "flashcards-mcp": {
      "command": "node",
      "args": ["$MCP_SERVER_PATH"],
      "env": {},
      "timeout": 120000
    }
  }
}
EOF

echo "✅ MCP server created at $MCP_SERVER_PATH"
echo "✅ MCP configuration created at $PROJECT_DIR/.amazonq/mcp.json"
echo "✅ Dependencies defined in $PROJECT_DIR/.amazonq/package.json"
echo "📦 Installing dependencies..."

# Install dependencies
cd "$PROJECT_DIR/.amazonq" && npm install

if [ $? -eq 0 ]; then
  echo "✅ Dependencies installed successfully"
  echo ""
  echo "🔄 Restart VS Code to load the MCP server"
  echo ""
  echo "Then Amazon Q can:"
  echo "  • Analyze PDFs: 'Can you analyze /path/to/file.pdf?'"
  echo "  • Scrape websites: 'Can you get content from https://example.com?'"
  echo "  • Generate flashcards from the extracted content"
else
  echo "❌ Failed to install dependencies"
  echo "Run manually: cd $PROJECT_DIR/.amazonq && npm install"
  exit 1
fi
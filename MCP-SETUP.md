# MCP Server Setup Guide

This guide explains how to set up the MCP server for different AI tools to generate flashcards from PDFs and websites.

## Quick Setup (Amazon Q)

```bash
./mcp-setup.sh
```

Then restart VS Code. Amazon Q will automatically detect the MCP server.

## Manual Setup for Other AI Tools

### For Claude Desktop

1. **Run the setup script:**
   ```bash
   ./mcp-setup.sh
   ```

2. **Edit Claude's config file:**
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

3. **Add this configuration:**
   ```json
   {
     "mcpServers": {
       "flashcards-mcp": {
         "command": "node",
         "args": ["/absolute/path/to/your/project/.amazonq/mcp-server.js"],
         "env": {}
       }
     }
   }
   ```

4. **Restart Claude Desktop**

### For Other MCP-Compatible Tools

1. **Run setup script:**
   ```bash
   ./mcp-setup.sh
   ```

2. **Use the MCP server directly:**
   - **Server path**: `.amazonq/mcp-server.js`
   - **Protocol**: stdio
   - **Command**: `node .amazonq/mcp-server.js`

3. **Available tools:**
   - `ingest_pdf` - Extract content from PDF files
   - `ingest_website` - Extract content from websites

## Configuration Files Created

- `.amazonq/mcp-server.js` - The MCP server
- `.amazonq/package.json` - Dependencies
- `.amazonq/mcp.json` - Amazon Q configuration

## Usage Examples

Once set up, ask your AI assistant:

- "Can you analyze this PDF and create flashcards: `/path/to/document.pdf`"
- "Create flashcards from this website: `https://example.com/tutorial`"
- "Extract content from this PDF and generate 10 flashcards for the 'python-basics' subject"

The AI will use the MCP tools to extract content and generate properly formatted flashcard JSON files in your `server/content/` directory.

## Troubleshooting

**Dependencies not installed:**
```bash
cd .amazonq && npm install
```

**Server not detected:**
- Restart your AI tool completely
- Check the absolute path in config files
- Ensure `.amazonq/mcp-server.js` is executable

**Permission errors:**
```bash
chmod +x .amazonq/mcp-server.js
```
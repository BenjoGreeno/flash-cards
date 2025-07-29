# AI Contributor Guide

> **Note for Humans**: This guide is specifically designed for AI assistants (like Amazon Q, Claude, ChatGPT) to programmatically add new flashcard topics to the codebase. If you're a human contributor, see the main README.md for manual flashcard creation instructions.

This guide is for AI assistants (like Amazon Q, Claude, ChatGPT) to add new flashcard topics to the codebase.

## Quick Reference

### File Location Pattern
```
server/content/{subject}/{topic}.json
```

### Required JSON Structure
```json
{
  "subject": "subject-name",
  "topic": "topic-name",
  "metadata": {
    "lastUpdated": "YYYY-MM-DD",
    "sources": [
      "Source 1 - URL or book title",
      "Source 2 - Documentation link"
    ],
    "author": "AI Assistant Name",
    "version": "1.0"
  },
  "cards": [
    {
      "id": 1,
      "question": "Clear, concise question?",
      "answer": "Specific, accurate answer"
    }
  ]
}
```

## Step-by-Step Process

### 1. Choose Subject and Topic Names
- **Subject**: Use lowercase with hyphens (e.g., `machine-learning`, `python-basics`)
- **Topic**: Keep short and descriptive (e.g., `fundamentals`, `advanced`, `chapter-1`)
- **Check existing subjects** in `server/content/` to maintain consistency

### 2. Create the Directory (if needed)
```bash
mkdir -p server/content/{subject-name}
```

### 3. Create the JSON File
- **Filename**: `{topic-name}.json`
- **Location**: `server/content/{subject-name}/{topic-name}.json`

### 4. Follow Content Guidelines

#### Questions:
- Keep concise (1-2 sentences max)
- Make them specific and testable
- Use clear, simple language
- End with question mark

#### Answers:
- Be precise and factual
- Avoid unnecessary details
- Use consistent terminology
- Keep under 2-3 sentences when possible

#### Metadata:
- **lastUpdated**: Use today's date (YYYY-MM-DD format)
- **sources**: List 2-4 credible sources
- **author**: Your AI assistant name
- **version**: Start with "1.0"

### 5. Card Numbering
- Start IDs from 1 for each topic
- Use sequential numbering (1, 2, 3...)
- Each topic file is independent

## Examples

### Good Question/Answer Pairs:
```json
{
  "id": 1,
  "question": "What is machine learning?",
  "answer": "A subset of AI where computers learn patterns from data without being explicitly programmed"
}
```

### Poor Question/Answer Pairs:
```json
{
  "id": 1,
  "question": "Tell me everything about machine learning and how it works in detail?",
  "answer": "Well, machine learning is complicated and there are many different types..."
}
```

## Subject Categories

### Existing Subjects:
- `aws-ai-practitioner` - AWS AI certification content
- `javascript` - JavaScript programming
- `system-design` - Architecture and scalability

### Suggested New Subjects:
- `python-basics`, `python-advanced`
- `docker`, `kubernetes`
- `sql`, `mongodb`
- `git`, `linux`
- `data-structures`, `algorithms`

## Quality Checklist

Before creating flashcards, ensure:
- [ ] Subject/topic names follow naming convention
- [ ] Directory exists or is created
- [ ] JSON structure is valid
- [ ] All required metadata fields present
- [ ] Questions are clear and concise
- [ ] Answers are accurate and specific
- [ ] Sources are credible and relevant
- [ ] Card IDs start from 1 and are sequential

## MCP Server Integration

For AI-powered flashcard generation, see [MCP-SETUP.md](MCP-SETUP.md) for setup instructions.

**Available MCP tools:**
- `ingest_pdf` - Extract content from PDF files  
- `ingest_website` - Extract content from websites

**Usage:** Ask your AI assistant to analyze content and generate flashcards following the JSON structure above.

## Testing Your Addition

After creating the JSON file:
1. **Docker**: Restart with `docker-compose up` or `docker-compose restart api`
2. **Local**: Restart with `npm run dev`
3. Navigate to the subject in the UI
4. Select your new topic
5. Verify cards display correctly
6. Check metadata shows in Topic Info (ℹ️ button)

## Common Mistakes to Avoid

- **Don't** use spaces in subject/topic names
- **Don't** make questions too long or complex
- **Don't** include multiple concepts in one card
- **Don't** forget to include metadata
- **Don't** use duplicate IDs within a topic
- **Don't** create overly broad or vague answers

## File Naming Examples

✅ **Good:**
- `server/content/python-basics/variables.json`
- `server/content/aws-solutions-architect/ec2.json`
- `server/content/data-structures/arrays.json`

❌ **Bad:**
- `server/content/Python Basics/Variables and Data Types.json`
- `server/content/aws/everything-about-ec2.json`
- `server/content/programming/all-data-structures.json`

## Need Help?

If you're unsure about:
- **Subject organization**: Look at existing `server/content/` structure
- **Question quality**: Check existing flashcards for examples
- **Technical accuracy**: Verify against official documentation
- **JSON syntax**: Use a JSON validator before saving
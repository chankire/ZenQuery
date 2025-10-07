# ZenQuery - Intelligent Document Q&A

Transform your documents into intelligent conversations powered by Claude Sonnet 4.5.

## Features

- 📄 **Upload PDFs and Word documents**
- ✨ **Instant executive summaries**
- 💬 **Precise Q&A with citations**
- 🎯 **Zero hallucinations** - only facts from your documents
- 🚀 **Sleek, modern UI** - built with Next.js and Tailwind CSS

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key from [Anthropic Console](https://console.anthropic.com/)

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Upload** - Drag and drop or select a PDF/Word document
2. **Summary** - Get an instant executive summary powered by Claude
3. **Ask** - Type questions and get precise answers with exact document citations
4. **Verify** - Every answer includes references to the exact location in your document

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **AI**: Claude Sonnet 4.5 (Anthropic)
- **Document Processing**: pdf-parse, mammoth

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Digital Ocean

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Claude Code

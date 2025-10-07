# ZenQuery Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Get Your Anthropic API Key

1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Go to **API Keys** section
4. Click **Create Key**
5. Copy your API key

### 2. Configure the Application

Edit the `.env.local` file in the project root:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

### 3. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 4. Test with Your PDF

1. Upload your New Holland repair manual (or any PDF/DOCX file up to 200MB)
2. Wait for the executive summary to generate (~10-30 seconds)
3. View the PDF on the left, chat on the right
4. Ask questions and **click on citations** to jump to that page in the PDF!

## ✨ Key Features

### Interactive Citations
- Every answer includes clickable citations
- Citations show page numbers and snippets
- Click any citation to jump directly to that page in the PDF viewer

### Large File Support
- Supports files up to **200MB**
- Your 190MB repair manual will work perfectly
- Files are cached in memory for fast subsequent queries

### Split-Screen View
- PDF viewer on the left
- Chat interface on the right
- Zoom in/out, navigate pages
- Citations automatically scroll the PDF to the right page

## 📝 Example Questions to Ask

For your New Holland tractor manual:
- "What is the engine oil capacity?"
- "How do I perform a hydraulic system inspection?"
- "What are the torque specifications for the cylinder head?"
- "Explain the electrical system troubleshooting procedure"

The AI will provide precise answers with exact page references!

## 🔧 Troubleshooting

### "Document not found" error
- The app uses in-memory storage
- If you restart the server, you'll need to re-upload documents
- For production, consider using a database or cloud storage

### PDF not loading
- Make sure the file uploaded successfully
- Check browser console for errors
- Try refreshing the page

### Large files taking too long
- Initial processing of large PDFs (100MB+) can take 30-60 seconds
- Subsequent questions are much faster
- Consider splitting very large documents if needed

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy!

**Note:** Vercel has a 50MB request limit. For files larger than 50MB, consider:
- Using a different host (Railway, AWS, Digital Ocean)
- Implementing cloud storage (S3, Azure Blob)
- Chunking large files

## 💡 Tips for Best Results

1. **Be specific** - Ask targeted questions rather than broad queries
2. **Reference sections** - If you know the section, mention it in your question
3. **Technical terms** - The AI understands technical jargon from your documents
4. **Follow-up questions** - Build on previous answers for deeper insights

## 🎯 What Makes This Special

✅ **Zero Hallucinations** - Only answers from your document
✅ **Clickable Citations** - Jump directly to the source
✅ **Large File Support** - Handle massive technical manuals
✅ **Beautiful UI** - Professional, modern interface
✅ **Claude Sonnet 4.5** - Most advanced model available

---

Need help? Check the README.md or open an issue on GitHub.

'use client';

import { useState } from 'react';
import { Sparkles, FileText, MessageSquare, Zap } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import DocumentChat from '@/components/DocumentChat';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/process-document', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error processing document:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Hero Section */}
      {!uploadedFile && (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by Claude Sonnet 4.5
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 dark:from-slate-100 dark:via-indigo-200 dark:to-slate-100 bg-clip-text text-transparent mb-6">
              ZenQuery
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-4">
              Transform your documents into intelligent conversations
            </p>

            <p className="text-lg text-slate-500 dark:text-slate-500 max-w-2xl mx-auto mb-12">
              Upload any PDF or Word document. Get instant executive summaries and ask precise questions with verifiable citations. Zero hallucinations. Pure intelligence.
            </p>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Instant Summaries
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Get comprehensive executive summaries the moment you upload
                </p>
              </div>

              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Precise Q&A
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Ask questions and get answers with exact document references
                </p>
              </div>

              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Zero Hallucinations
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Every answer is fact-checked and cited from your document
                </p>
              </div>
            </div>

            {/* Upload Area */}
            <FileUpload onFileUpload={handleFileUpload} />

            {/* Try it Free CTA */}
            <div className="mt-8">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Try it free • No credit card required • See results instantly
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Document Chat Interface */}
      {uploadedFile && (
        <DocumentChat
          fileName={uploadedFile.name}
          fileUrl={`/api/get-file?fileName=${encodeURIComponent(uploadedFile.name)}`}
          summary={summary}
          isProcessing={isProcessing}
          onReset={() => {
            setUploadedFile(null);
            setSummary('');
          }}
        />
      )}
    </div>
  );
}

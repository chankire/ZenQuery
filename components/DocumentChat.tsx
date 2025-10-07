'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, FileText, X, Loader2, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import dynamic from 'next/dynamic';

// Dynamically import PDFViewer to avoid SSR issues
const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading PDF viewer...</div>
});

interface Citation {
  text: string;
  page?: number;
  snippet?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
}

interface DocumentChatProps {
  fileName: string;
  documentId: string;
  fileUrl: string;
  summary: string;
  isProcessing: boolean;
  onReset: () => void;
}

export default function DocumentChat({
  fileName,
  documentId,
  fileUrl,
  summary,
  isProcessing,
  onReset,
}: DocumentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: input,
          documentId,
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer,
        citations: data.citations,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitationClick = (citation: Citation) => {
    if (citation.page) {
      setCurrentPage(citation.page);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                  {fileName}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Ready to answer your questions
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              New Document
            </Button>
          </div>
        </div>

        {/* Executive Summary */}
        {summary && (
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-indigo-200 dark:border-indigo-800 p-6 mb-4">
            <div className="flex items-start gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-1" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Executive Summary
              </h3>
            </div>
            <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line pl-8">
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing document...</span>
                </div>
              ) : (
                summary
              )}
            </div>
          </Card>
        )}

        {/* Main Content: PDF + Chat Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* PDF Viewer */}
          <div className="h-[700px]">
            <PDFViewer
              fileUrl={fileUrl}
              highlightPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Chat Messages */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="h-[700px] overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && !isProcessing && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  Ask any question about your document
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  I&apos;ll provide precise answers with exact citations
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  <div className="whitespace-pre-line">{message.content}</div>
                  {message.citations && message.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-600">
                      <p className="text-xs font-semibold mb-2 text-slate-600 dark:text-slate-400">
                        Citations (click to view):
                      </p>
                      <div className="space-y-2">
                        {message.citations.map((citation, i) => (
                          <button
                            key={i}
                            onClick={() => handleCitationClick(citation)}
                            className="flex items-start gap-2 w-full text-left p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors group"
                          >
                            <ExternalLink className="w-3 h-3 mt-0.5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                {citation.text}
                              </div>
                              {citation.snippet && (
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
                                  &quot;{citation.snippet}&quot;
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span className="text-slate-600 dark:text-slate-400">
                      Analyzing...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask a question about your document..."
              disabled={isLoading || isProcessing}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading || isProcessing}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

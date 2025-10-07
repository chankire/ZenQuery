'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer
        ${isDragActive
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 scale-105'
          : 'border-slate-300 dark:border-slate-700 bg-white/30 dark:bg-slate-800/30 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-white/50 dark:hover:bg-slate-800/50'
        }
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center transition-all
          ${isDragActive
            ? 'bg-indigo-500 scale-110'
            : 'bg-indigo-100 dark:bg-indigo-900/30'
          }
        `}>
          {isDragActive ? (
            <FileText className="w-8 h-8 text-white" />
          ) : (
            <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
          )}
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {isDragActive ? 'Drop your document here' : 'Upload your document'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Drag & drop or click to browse
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Supports PDF, DOC, DOCX
          </p>
        </div>

        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8"
          onClick={(e) => e.stopPropagation()}
        >
          Choose File
        </Button>
      </div>
    </div>
  );
}

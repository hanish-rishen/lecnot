// app/dashboard/page.tsx
"use client";

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import Sidebar from '@/components/Sidebar';
import ImageGallery from '@/components/ImageGallery';
import EditableNotes from '@/components/EditableNotes';

interface Figure {
  name: string;
  data: string;
}

interface ResponseData {
  textContent?: string;
  figures?: Figure[];
  notes?: string;
  error?: string;
}

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [responseData, setResponseData] = useState<ResponseData | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setUploading(true);
    setUploadStatus('idle');
    setResponseData(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while uploading the file.');
      }

      setResponseData({
        textContent: data.data.text,
        figures: data.data.figures.map((figure: any, index: number) => ({
          name: `Figure ${index + 1}`,
          data: `data:image/png;base64,${figure.data}`
        })),
        notes: data.data.notes
      });
      setUploadStatus('success');
    } catch (error) {
      console.error('Error from server:', (error as Error).message);
      setUploadStatus('error');
      setResponseData({
        error: (error as Error).message,
        notes: (error as any).partialNotes || 'Unable to process the file.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleNotesChange = (newNotes: string) => {
    setResponseData(prevData => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        notes: newNotes
      };
    });
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-full mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-white">Dashboard</h1>
          <div className="mb-8 border-2 border-white rounded-lg p-6 w-full">
            <h2 className="text-2xl font-semibold mb-4 text-white">Upload PDF</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="fileInput"
                accept=".pdf"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
              >
                Choose PDF
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-300">
                  Selected file: {file.name}
                </p>
              )}
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-black bg-white rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload and Process'}
              </button>
            </div>
            {uploadStatus === 'error' && (
              <p className="mt-4 text-red-400">{responseData?.error}</p>
            )}
            {uploadStatus === 'success' && (
              <p className="mt-4 text-green-400">File processed successfully!</p>
            )}
          </div>
          {responseData && (
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 border-2 border-white rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-white">Extracted Images</h2>
                <ImageGallery figures={responseData.figures || []} />
              </div>
              <div className="w-full md:w-1/2 border-2 border-white rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-white">Generated Notes</h2>
                <EditableNotes notes={responseData.notes || ''} onNotesChange={handleNotesChange} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

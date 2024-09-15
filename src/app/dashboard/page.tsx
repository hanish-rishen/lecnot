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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
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
                className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
              >
                Choose PDF
              </label>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {file.name}
                </p>
              )}
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload and Process'}
              </button>
            </div>
            {uploadStatus === 'error' && (
              <p className="mt-4 text-red-600">{responseData?.error}</p>
            )}
            {uploadStatus === 'success' && (
              <p className="mt-4 text-green-600">File processed successfully!</p>
            )}
          </div>
        </div>
        {responseData && (
          <div className="flex space-x-8">
            <div className="w-1/2">
              <h2 className="text-2xl font-bold mb-4">Extracted Images</h2>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <ImageGallery figures={responseData.figures || []} />
              </div>
            </div>
            <div className="w-1/2">
              <h2 className="text-2xl font-bold mb-4">Generated Notes</h2>
              <div className="bg-white p-4 rounded-lg shadow-md h-full">
                <EditableNotes notes={responseData.notes || ''} onNotesChange={handleNotesChange} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

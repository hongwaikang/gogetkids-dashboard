'use client'
// BulkImportForm.tsx
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import React, { useRef } from 'react';
import { parseCSV } from '@/app/lib/csvParser'; // Import the CSV parser

export default function BulkImportForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      const file = fileInputRef.current.files[0];

      console.log('File selected:', file);
      console.log('File type:', file.type);

      // Log the file content
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('File content:', e.target?.result);
      };
      reader.readAsText(file);

      // Print CSV content to the console using Papaparse
      parseCSV(file)
        .then((csvData) => console.log('Parsed CSV Content:', csvData))
        .catch((error) => console.error('Error parsing CSV:', error));
    } else {
      console.error('No file selected or file input not found.');
    }
  };

  return (
    <form>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* File Input */}
        <div className="mb-4">
          <label htmlFor="csvFile" className="mb-2 block text-sm font-medium">
            Upload CSV File
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                ref={fileInputRef}
                id="csvFile"
                name="csvFile"
                type="file"
                accept=".csv"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/teachers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        {/* Use handleFileUpload as onClick handler */}
        <Button type="button" onClick={handleFileUpload}>
          Print CSV Content
        </Button>
      </div>
    </form>
  );
}

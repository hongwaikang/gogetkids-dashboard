'use client'

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import React, { useRef } from 'react';
import { parseJSON, insertTeachersFromJSON } from '@/app/lib/csvParser';
import toast from 'react-hot-toast';

const BulkImportForm = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      const file = fileInputRef.current.files[0];

      console.log('File selected:', file);
      console.log('File type:', file.type);

      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target && event.target.result) {
          const jsonData = event.target.result as string;

          try {
            // Parse the JSON data
            const parsedTeachers = await parseJSON(jsonData);
            console.log('Parsed teachers:', parsedTeachers);

            // Insert teachers into the database
            await insertTeachersFromJSON(parsedTeachers);
            console.log('Teachers inserted successfully');
            toast.success('Teachers inserted successfully!');
          } catch (error) {
            console.error('Error importing teachers:', error);
            toast.error('Failed to import teachers. Please try again.');
          }
        }
      };
      reader.readAsText(file);
    } else {
      console.error('No file selected or file input not found.');
    }
  };

  return (
    <form>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* File Input */}
        <div className="mb-4">
          <label htmlFor="jsonFile" className="mb-2 block text-sm font-medium">
            Upload JSON File
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                ref={fileInputRef}
                id="jsonFile"
                name="jsonFile"
                type="file"
                accept=".json"
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
          Return
        </Link>
        {/* Use handleFileUpload as onClick handler */}
        <Button type="button" onClick={handleFileUpload}>
          Bulk Create
        </Button>
      </div>
    </form>
  );
};

export default BulkImportForm;

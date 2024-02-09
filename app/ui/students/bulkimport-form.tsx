'use client'

import Link from 'next/link';
import { Button } from '@/app/ui/button';
import React, { useRef } from 'react';
import { parseStudentsJSON, insertStudentsFromJSON } from '@/app/lib/bulkUpload';
import toast from 'react-hot-toast';

const BulkImportForm = () => {
  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleJSONFileUpload = async () => {
    if (jsonFileInputRef.current && jsonFileInputRef.current.files) {
      const file = jsonFileInputRef.current.files[0];

      console.log('File selected:', file);
      console.log('File type:', file.type);

      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target && event.target.result) {
          const jsonData = event.target.result as string;

          try {
            const parsedStudents = await parseStudentsJSON(jsonData);
            console.log('Parsed students:', parsedStudents);

            await insertStudentsFromJSON(parsedStudents);
            console.log('Students inserted successfully');
            toast.success('Students inserted successfully!');
          } catch (error) {
            console.error('Error importing students:', error);
            toast.error('Failed to import students. Please try again.');
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
      <div className="rounded-md bg-gray-50 p-6 md:p-8 space-y-6">
        {/* JSON File Input */}
        <div>
          <label htmlFor="jsonFile" className="block text-sm font-medium">
            Upload JSON File
          </label>
          <div className="mt-2">
            <input
              ref={jsonFileInputRef}
              id="jsonFile"
              name="jsonFile"
              type="file"
              accept=".json"
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">Please ensure that the uploaded JSON file follows the specified format:</p>
            <pre className="mt-2 bg-gray-100 p-2 rounded-md overflow-auto">{`
            Leave studentid blank

            {
              "studentid: "",
              "firstname": "John",
              "lastname": "Doe",
              "gender": "Male",
              "address": "123 Main St",
              "postcode": "12345",
              "dob": "2000-01-01",
              "zone": "A",
              "parent_id": "123456",
              "class_name": "Math",
              "school_name": "Springfield High School"
            }`}</pre>

          {/* Bulk Create JSON Button */}
          <Button type="button" onClick={handleJSONFileUpload} className="mt-4">
            Bulk Create JSON
          </Button>
        </div>
      </div>

      {/* Return Button */}
      <div className="mt-6 flex justify-end">
        <Link
          href="/dashboard/students"
          className="h-10 flex items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Return
        </Link>
      </div>
    </form>
  );
};

export default BulkImportForm;

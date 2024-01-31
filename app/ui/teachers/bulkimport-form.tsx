import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { bulkCreateTeachers } from '@/app/lib/actions';

export default function BulkImportForm() {
  return (
    <form action={bulkCreateTeachers}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* File Input */}
        <div className="mb-4">
          <label htmlFor="csvFile" className="mb-2 block text-sm font-medium">
            Upload CSV File
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
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
        <Button type="submit">Create Teacher</Button>
      </div>
    </form>
  );
}
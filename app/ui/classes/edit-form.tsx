'use client';

import { ClassForm } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateClass } from '@/app/lib/actions';

export default function EditClassForm({
  class1,
}: {
  class1: ClassForm;
}) {

  const updateClassWithId = updateClass.bind(null, class1.id);

  return (
    <form action={updateClassWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Class ID */}
        <div className="mb-4">
          <label htmlFor="id" className="mb-2 block text-sm font-medium">
            Class ID
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="id"
                name="id"
                type="text"
                defaultValue={class1.id}
                disabled
                placeholder="Enter Class ID"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500 bg-gray-200"
                required
              />
            </div>
          </div>
        </div>

        {/* Class Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Class Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter Class Name"
                defaultValue={class1.name}
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Level */}
        <div className="mb-4">
          <label htmlFor="level" className="mb-2 block text-sm font-medium">
            Level
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="level"
                name="level"
                type="text"
                placeholder="Enter Level"
                defaultValue={class1.level}
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Teacher ID */}
        <div className="mb-4">
          <label htmlFor="teacher_id" className="mb-2 block text-sm font-medium">
            Teacher ID
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="teacher_id"
                name="teacher_id"
                type="text"
                placeholder="Enter Teacher ID"
                defaultValue={class1.teacher_id}
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/classes"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Class</Button>
      </div>
    </form>
  );
}

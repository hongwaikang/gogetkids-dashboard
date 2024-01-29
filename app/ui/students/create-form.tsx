import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { createStudent } from '@/app/lib/actions';

export default function Form() {

  return (
    <form action={createStudent}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Student ID */}
        <div className="mb-4">
          <label htmlFor="id" className="mb-2 block text-sm font-medium">
            Student ID
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="id"
                name="id"
                type="text"
                placeholder="Enter Student ID"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* First Name */}
        <div className="mb-4">
          <label htmlFor="firstname" className="mb-2 block text-sm font-medium">
            First Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Enter First Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Last Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Enter Last Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label htmlFor="dateofbirth" className="mb-2 block text-sm font-medium">
            Date of Birth
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="dateofbirth"
              name="dateofbirth"
              type="date"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Address */}
        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium">
            Address
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter Block No. and Street"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Postalcode */}
        <div className="mb-4">
          <label htmlFor="postalcode" className="mb-2 block text-sm font-medium">
            Postal Code
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="postalcode"
              name="postalcode"
              type="text"
              maxLength={10}
              placeholder="Enter Postal Code"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-4 text-sm outline-2 placeholder:text-gray-500"
              required
            />
          </div>
        </div>

        {/* Class ID */}
        <div className="mb-4">
          <label htmlFor="class_id" className="mb-2 block text-sm font-medium">
            Class ID
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="class_id"
                name="class_id"
                type="text"
                placeholder="Enter Class ID"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Parent ID */}
        <div className="mb-4">
          <label htmlFor="parent_id" className="mb-2 block text-sm font-medium">
            Parent ID
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="parent_id"
                name="parent_id"
                type="text"
                placeholder="Enter Parent's ID"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/students"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Student</Button>
      </div>
    </form>
  );
}
'use client';

import { TeacherForm } from '@/app/lib/definitions';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { updateTeacher } from '@/app/lib/actions';

export default function EditTeacherForm({
  teacher,
}: {
  teacher: TeacherForm;
}) {

  const updateTeacherWithId = updateTeacher.bind(null, teacher.id);

  return (
    <form action={updateTeacherWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
          {/* Teacher ID */}
      <div className="mb-4">
          <label htmlFor="id" className="mb-2 block text-sm font-medium">
            Teacher ID
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="id"
                name="id"
                type="text"
                defaultValue={teacher.id}
                readOnly
                placeholder="Enter Teacher ID"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500 bg-gray-200"
                required
              />
            </div>
          </div>
        </div>

        {/* Username or Email */}
        <div className="mb-4">
          <label htmlFor="username" className="mb-2 block text-sm font-medium">
            Username
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
								defaultValue={teacher.username}
                placeholder="Enter email"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

				{/* Password */}
				<div className="mb-4">
          <label htmlFor="password" className="mb-2 block text-sm font-medium">
            Password
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
								defaultValue={teacher.password}
                placeholder="Enter password"
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
								defaultValue={teacher.firstname}
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
								defaultValue={teacher.lastname}
                placeholder="Enter Last Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Country Code */}
        <div className="mb-4">
          <label htmlFor="country_code" className="mb-2 block text-sm font-medium">
            Country Code
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="country_code"
                name="country_code"
                type="text"
                defaultValue={teacher.country_code}
                placeholder="Enter Country Code"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Phone
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="text"
								defaultValue={teacher.phone}
                placeholder="Enter Phone Number"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Class ID */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Class ID
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="class_id"
                name="class_id"
                type="text"
								defaultValue={teacher.class_id}
                placeholder="Enter Class ID"
                className="peer block w-full rounded-md border border-gray-200 py-2 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/parents"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Edit Teacher</Button>
      </div>
    </form>
  );
}

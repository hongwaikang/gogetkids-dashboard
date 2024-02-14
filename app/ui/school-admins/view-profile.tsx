'use client'

import Link from 'next/link';
import { deleteSchoolAdmin } from '@/app/lib/actions2'; // Import the deleteSchoolAdmin function

const ViewProfile = ({ schoolAdmin }: { schoolAdmin: any }) => {
  const handleDelete = async () => {
    // Call the deleteSchoolAdmin function with the school admin ID
    const result = await deleteSchoolAdmin(schoolAdmin._id);
    // Handle the deletion result if needed
    console.log(result);
  };

  return (
    <div>
      <h1>School Admin Profile</h1>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium">First Name:</label>
          <p className="mt-1 text-sm text-gray-900">{schoolAdmin.firstname}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Last Name:</label>
          <p className="mt-1 text-sm text-gray-900">{schoolAdmin.lastname}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Email:</label>
          <p className="mt-1 text-sm text-gray-900">{schoolAdmin.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">School Name:</label>
          <p className="mt-1 text-sm text-gray-900">{schoolAdmin.school_name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Role:</label>
          <p className="mt-1 text-sm text-gray-900">{schoolAdmin.role}</p>
        </div>

        {/* Delete button */}
        <button onClick={handleDelete} className="flex h-10 items-center rounded-lg bg-red-500 px-4 text-sm font-medium text-white transition-colors hover:bg-red-600">
          Delete Profile
        </button>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link href={`/system-admin-dashboard/school-admins/${schoolAdmin._id}/edit`} className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Edit Profile
        </Link>
        <Link href="/system-admin-dashboard/school-admins" className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
          Return
        </Link>
      </div>
    </div>
  );
};

export default ViewProfile;

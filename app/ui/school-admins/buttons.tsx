import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
//import { deleteSchoolAdmin } from '@/app/lib/actions'; // Assuming deleteSchoolAdmin function exists

export function CreateSchoolAdmin() {
  return (
    <Link
      href="/system-admin-dashboard/school-admins/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create School Admin</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateSchoolAdmin({ id }: { id: string }) {
  return (
    <Link
      href={`/system-admin-system-admin-dashboard/school-admins/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteSchoolAdmin({ id }: { id: string }) {
  return (
    <form>
      <button type="button" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-4" />
      </button>
    </form>
  );
}


// Bulk Import
export function BulkImportSchoolAdmins() {
  return (
    <Link
      href="/system-admin-dashboard/school-admins/bulk-import"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Bulk Import School Admins</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

import { UpdateParent, DeleteParent } from '@/app/ui/parents/buttons';
import { fetchFilteredParents } from '@/app/lib/data';
import Link from 'next/link';

interface ParentsTableProps {
  query: string;
  currentPage: number;
  schoolName: string; // Add schoolName prop to the interface
}

export default async function ParentsTable({
  query,
  currentPage,
  schoolName, // Destructure schoolName from props
}: ParentsTableProps) {
  let parents: any[] = [];

  try {
    parents = await fetchFilteredParents(query, currentPage, schoolName); // Pass schoolName to fetch function
  } catch (error) {
    console.error('Error fetching parents:', error);
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Contact Number
                </th>
                {/* Actions column */}
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {parents?.map((parent) => (
                <tr
                  key={parent._id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <Link href={`/dashboard/parents/${parent._id}`}>
                      <span className="text-blue-600 cursor-pointer underline">
                        <p>{parent.email}</p>
                      </span>
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {`${parent.firstName} ${parent.lastName}`}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {parent.phoneNum}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateParent id={parent._id} />
                      <DeleteParent id={parent._id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

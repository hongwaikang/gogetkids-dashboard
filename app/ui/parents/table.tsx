import { UpdateParent, DeleteParent } from '@/app/ui/parents/buttons';
import { fetchFilteredParents } from '@/app/lib/data';

export default async function ParentsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const parents = await fetchFilteredParents(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {parents?.map((parent) => (
              <div
                key={parent.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <p>{parent.id}</p>
                    </div>
                    <p className="text-sm text-gray-500">{parent.name}</p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-md font-medium">{parent.phone_number}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateParent id={parent.id} />
                    <DeleteParent id={parent.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Phone Number
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
                  key={parent.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{parent.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {parent.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {parent.phone_number}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateParent id={parent.id} />
                      <DeleteParent id={parent.id} />
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

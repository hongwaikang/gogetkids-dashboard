import { UpdateClass, DeleteClass } from '@/app/ui/classes/buttons';
import { fetchFilteredClasses } from '@/app/lib/data';

export default async function ClassesTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const classes = await fetchFilteredClasses(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Level
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Teacher ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Teacher Name
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {classes?.map((class1) => (
                <tr
                  key={class1.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{class1.id}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {class1.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {class1.level}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {class1.teacher_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {class1.teacher_name}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateClass id={class1.id} />
                      <DeleteClass id={class1.id} />
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

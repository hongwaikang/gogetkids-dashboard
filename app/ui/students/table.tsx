import { UpdateStudent, DeleteStudent } from '@/app/ui/students/buttons';
import { fetchFilteredStudents } from '@/app/lib/testData';

export default async function StudentsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  let students: any[] = [];

  try {
    students = await fetchFilteredStudents(query, currentPage);
  } catch (error) {
    console.error('Error fetching students:', error);
  }

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
                <th scope="col" className="px-4 py-5 font-medium">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Class ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Parent ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Parent Name
                </th>
                <th
                  scope="col"
                  className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                >
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {student.id}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {`${student.firstname} ${student.lastname}`}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {student.class_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {student.parent_id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {student.parent_name}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateStudent id={student.id} />
                      <DeleteStudent id={student.id} />
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

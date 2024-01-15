import { UpdateStudent, DeleteStudent } from '@/app/ui/students/buttons';
import { fetchFilteredStudents } from '@/app/lib/data';

export default async function StudentsTable({
    query,
    currentPage,
  }: {
    query: string;
    currentPage: number;
  }) {
    const students = await fetchFilteredStudents(query, currentPage);

    return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {students?.map((student) => (
                <div
                  key={student.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{`${student.first_name} ${student.last_name}`}</p>
                      </div>
                      <p className="text-sm text-gray-500">{student.parent_name}</p>
                    </div>
                    {/* Actions for students, e.g., UpdateStudent and DeleteStudent components */}
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-md font-medium">
                        {student.class_id}
                      </p>
                      <p className="text-sm">{student.address}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <UpdateStudent id={student.id} />
                      <DeleteStudent id={student.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full text-gray-900 md:table">
              {/* Similar table structure as InvoicesTable, adapt column names as needed */}
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Student
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Parent
                  </th>
                  {/* Additional columns for student details */}
                  <th scope="col" className="px-3 py-5 font-medium">
                    Class ID
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Address
                  </th>
                  {/* Actions column */}
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {students?.map((student) => (
                  <tr
                    key={student.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p>{`${student.first_name} ${student.last_name}`}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {student.parent_name}
                    </td>
                    {/* Render additional student details */}
                    <td className="whitespace-nowrap px-3 py-3">
                      {student.class_id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {student.address}
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

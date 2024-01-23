import Form from '@/app/ui/students/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchStudentById } from '@/app/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const student = await fetchStudentById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Students', href: '/dashboard/students' },
          {
            label: 'Edit Student',
            href: `/dashboard/students/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form student={student} />
    </main>
  );
}

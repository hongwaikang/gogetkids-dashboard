import Form from '@/app/ui/students/edit-form';
import Breadcrumbs from '@/app/ui/students/breadcrumbs';
import { fetchStudentById, fetchAllParentsEmail, fetchAllClassNames } from '@/app/lib/data';
import { ObjectId } from 'mongodb';
export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id); // Convert id to ObjectId
  const student = await fetchStudentById(id);
  const parents = await fetchAllParentsEmail();
  const classes = await fetchAllClassNames();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Students', href: '/dashboard/students' },
          {
            label: 'Edit Student',
            href: `/dashboard/students/${params.id}/edit`, // Use params.id directly here
            active: true,
          },
        ]}
      />
      <Form student={student} classes={classes} parents={parents} />
    </main>
  );
}

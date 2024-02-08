import Form from '@/app/ui/classes/edit-form';
import Breadcrumbs from '@/app/ui/classes/breadcrumbs';
import { fetchClassById, fetchAllTeachersEmail } from '@/app/lib/testData';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const classObject = await fetchClassById(id);
  const teachers = await fetchAllTeachersEmail();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Classes', href: '/dashboard/classes' },
          {
            label: 'Edit Class',
            href: `/dashboard/classes/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form classroom={classObject} teachers={teachers} />
    </main>
  );
}

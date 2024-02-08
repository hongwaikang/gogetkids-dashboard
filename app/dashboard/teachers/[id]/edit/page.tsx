import Form from '@/app/ui/teachers/edit-form';
import Breadcrumbs from '@/app/ui/teachers/breadcrumbs';
import { fetchTeacherById } from '@/app/lib/testData';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const teacher = await fetchTeacherById(id); // Fetch teacher data instead of parent data

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Teachers', href: '/dashboard/teachers' },
          {
            label: 'Edit Teacher',
            href: `/dashboard/teachers/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form teacher={teacher} />
    </main>
  );
}

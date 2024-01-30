import Form from '@/app/ui/classes/edit-form';
import Breadcrumbs from '@/app/ui/classes/breadcrumbs';
import { fetchClassById } from '@/app/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const class1 = await fetchClassById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Class', href: '/dashboard/classes' },
          {
            label: 'Edit Class',
            href: `/dashboard/classes/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form class1={class1} />
    </main>
  );
}

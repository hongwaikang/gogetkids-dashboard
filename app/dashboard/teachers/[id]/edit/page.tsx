import Form from '@/app/ui/teachers/edit-form';
import Breadcrumbs from '@/app/ui/teachers/breadcrumbs';
import { fetchTeacherById } from '@/app/lib/data';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const teacher = await fetchTeacherById(id);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Teachers', href: '/dashboard/teachers' },
          {
            label: 'Edit Teacher',
            href: `/dashboard/teachers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form teacher={teacher} />
    </main>
  );
}

import Form from '@/app/ui/classes/create-form';
import Breadcrumbs from '@/app/ui/classes/breadcrumbs';
import { fetchAllTeachersEmail } from '@/app/lib/data';

export default async function Page() {
  const teachers = await fetchAllTeachersEmail();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Class', href: '/dashboard/classes' },
          {
            label: 'Create Class',
            href: '/dashboard/classes/create',
            active: true,
          },
        ]}
      />
      <Form teachers={teachers} />
    </main>
  );
}
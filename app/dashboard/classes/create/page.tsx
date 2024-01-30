import Form from '@/app/ui/classes/create-form';
import Breadcrumbs from '@/app/ui/classes/breadcrumbs';

export default async function Page() {

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
      <Form/>
    </main>
  );
}
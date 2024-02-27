import Form from '@/app/ui/students/create-form';
import Breadcrumbs from '@/app/ui/students/breadcrumbs';

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Students', href: '/dashboard/students' },
          {
            label: 'Create Student',
            href: '/dashboard/students/create',
            active: true,
          },
        ]}
      />
      <Form/>
    </main>
  );
}
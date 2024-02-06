import Form from '@/app/ui/students/create-form';
import Breadcrumbs from '@/app/ui/students/breadcrumbs';
import { fetchAllParentsEmail, fetchAllClassNames } from '@/app/lib/testData';

export default async function Page() {
  const parents = await fetchAllParentsEmail();
  const classes = await fetchAllClassNames();

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
      {/* Pass in fetched parents and classes in to Form */}
      <Form parents={parents} classes={classes}/>
    </main>
  );
}
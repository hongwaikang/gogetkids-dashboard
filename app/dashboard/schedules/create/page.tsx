import Form from '@/app/ui/schedules/create-form';
import Breadcrumbs from '@/app/ui/schedules/breadcrumbs';
import { fetchAllStudentIds } from '@/app/lib/data';

export default async function Page() {
  const students = await fetchAllStudentIds();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Schedule', href: '/dashboard/schedules' },
          {
            label: 'Create Schedule',
            href: '/dashboard/schedules/create',
            active: true,
          },
        ]}
      />
      <Form students={students} />
    </main>
  );
}
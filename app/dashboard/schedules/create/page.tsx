import Form from '@/app/ui/schedules/create-form';
import Breadcrumbs from '@/app/ui/schedules/breadcrumbs';

export default async function Page() {

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
      <Form/>
    </main>
  );
}
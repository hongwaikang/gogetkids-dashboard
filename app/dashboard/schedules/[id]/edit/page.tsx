import Form from '@/app/ui/schedules/edit-form';
import Breadcrumbs from '@/app/ui/schedules/breadcrumbs';
import { fetchScheduleById, fetchAllStudentIds } from '@/app/lib/data';
import { ObjectId } from 'mongodb';

export default async function Page({ params }: { params: { id: string } }) {
  const id = new ObjectId(params.id);
  const schedule = await fetchScheduleById(id); // Fetch schedule data
  const students = await fetchAllStudentIds(); // Fetch students data

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Schedules', href: '/dashboard/schedules' },
          {
            label: 'Edit Schedule',
            href: `/dashboard/schedules/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form schedule={schedule} students={students} /> {/* Pass schedule and students as props */}
    </main>
  );
}

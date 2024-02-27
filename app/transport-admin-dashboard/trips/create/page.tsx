import Form from '@/app/ui/trips/create-form';
import Breadcrumbs from '@/app/ui/trips/breadcrumbs';
import { fetchAllDriversEmails, fetchAllVehicleIds, fetchCompanyName } from '@/app/lib/data3';
import { fetchSessionToken } from '@/app/lib/data';
import jwt, { JwtPayload } from 'jsonwebtoken';

export default async function Page() {

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Trips', href: '/transport-admin-dashboard/trips' },
          {
            label: 'Create Trip',
            href: '/transport-admin-dashboard/trips/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}

import Breadcrumbs from '@/app/ui/vehicles/breadcrumbs';
import BulkImportForm from '@/app/ui/vehicles/bulkimport-form';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Vehicles', href: '/dashboard/vehicles' },
          {
            label: 'Bulk Import',
            href: '/dashboard/vehicles/bulk-import',
            active: true,
          },
        ]}
      />
      <BulkImportForm />
    </main>
  );
}

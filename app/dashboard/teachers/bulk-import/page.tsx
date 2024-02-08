// Page.tsx
import Breadcrumbs from '@/app/ui/teachers/breadcrumbs';
import BulkImportForm from '@/app/ui/teachers/bulkimport-form';

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Teachers', href: '/dashboard/teachers' },
          {
            label: 'Bulk Import',
            href: '/dashboard/teachers/bulk-import',
            active: true,
          },
        ]}
      />
      <BulkImportForm />
      <p>Please ensure that the JSON file uploaded follows this format:</p>
      <pre>{`{
  "email": "emily.wilson@example.com",
  "firstName": "Emily",
  "lastName": "Wilson",
  "password": "Passwordabc",
  "phoneNum": "8888888888",
  "role": "teacher",
  "school_name": "Springfield High School"
}`}</pre>
    </main>
  );
}

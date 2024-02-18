import Form from '@/app/ui/classes/create-form';
import Breadcrumbs from '@/app/ui/classes/breadcrumbs';
import { fetchAllTeachersEmail, fetchSessionToken, fetchSchoolName } from '@/app/lib/data';
import jwt from 'jsonwebtoken';

export default async function Page() {

  // Fetch session token
  const sessionName = 'currentSession'; // Adjust session name according to your setup
  const token = await fetchSessionToken(sessionName);
  console.log('Session token:', token);

  // Verify and decode the token
  let decodedToken;
  try {
    // Type assertion to assert that token is a non-null string
    decodedToken = jwt.verify(token!, process.env.TOKEN_SECRET!);
    console.log('Decoded token data:', decodedToken);
  } catch (error) {
    console.error('Error verifying token:', error);
    // Handle error if token verification fails or token is null
    return null; // Or handle the error in some other way
  }

  // Extract user ID from decoded token
  const sessionUserId = decodedToken?.id;

  // Fetch the company name using the user ID
  const schoolName = await fetchSchoolName(sessionUserId);
  console.log('Company Name:', schoolName);

  const teachers = await fetchAllTeachersEmail(schoolName);

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
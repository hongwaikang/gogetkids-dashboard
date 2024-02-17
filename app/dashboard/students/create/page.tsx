import Form from '@/app/ui/students/create-form';
import Breadcrumbs from '@/app/ui/students/breadcrumbs';
import { fetchAllParentsEmail, fetchAllClassNames, fetchSessionToken, fetchSchoolName } from '@/app/lib/data';
import jwt from 'jsonwebtoken';

export default async function Page() {

  // Fetch session token
  const sessionName = 'currentSession'; // Adjust session name according to your setup
  const token = await fetchSessionToken(sessionName);
  console.log('Session token:', token);

  // Verify and decode the token
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!);
    console.log('Decoded token data:', decodedToken);
  } catch (error) {
    console.error('Error verifying token:', error);
    // Handle error if token verification fails
    return null; // Or handle the error in some other way
  }

  // Extract user ID from decoded token
  const sessionUserId = decodedToken?.id;

  // Fetch the company name using the user ID
  const schoolName = await fetchSchoolName(sessionUserId);
  console.log('Company Name:', schoolName);

  const parents = await fetchAllParentsEmail();
  const classes = await fetchAllClassNames(schoolName);

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
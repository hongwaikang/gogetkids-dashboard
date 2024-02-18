import Pagination from '@/app/ui/trips/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/trips/table';
import { CreateTrip, BulkImportTrips } from '@/app/ui/trips/buttons';
import { lusitana } from '@/app/ui/fonts';
import { DefaultSkeletonTable } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchSessionToken } from '@/app/lib/data';
import { fetchCompanyName, fetchTripsPages } from '@/app/lib/data3';
import jwt, { JwtPayload } from 'jsonwebtoken'; // Import jwt

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  // Fetch session token
  const sessionName = 'currentSession'; // Adjust session name according to your setup
  const token = await fetchSessionToken(sessionName);
  console.log('Session token:', token);

  // Verify and decode the token
  let decodedToken: JwtPayload | string; // Explicitly type decodedToken
  try {
    decodedToken = jwt.verify(token!, process.env.TOKEN_SECRET!);
    console.log('Decoded token data:', decodedToken);
  } catch (error) {
    console.error('Error verifying token:', error);
    // Handle error if token verification fails
    return null; // Or handle the error in some other way
  }

  const sessionUserId = typeof decodedToken === 'string' ? decodedToken : decodedToken?.id;
  console.log(sessionUserid);

  // Extract company_name from decoded token
  const companyName = await fetchCompanyName(sessionUserid);
  console.log(companyName);

  // Fetch trips pages with the school name
  const totalPages = await fetchTripsPages(query, companyName);

  // Handle the case where totalPages is undefined
  const totalPagesOrDefault = totalPages ?? 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Trips</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search trips..." />
        <CreateTrip />
        <BulkImportTrips />
      </div>
      <Suspense key={query + currentPage} fallback={<DefaultSkeletonTable />}>
        <Table query={query} currentPage={currentPage} companyName={companyName} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPagesOrDefault} />
      </div>
    </div>
  );
}

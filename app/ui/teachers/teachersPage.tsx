import Pagination from '@/app/ui/teachers/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/teachers/table';
import { CreateTeacher, BulkImportTeachers } from '@/app/ui/teachers/buttons';
import { lusitana } from '@/app/ui/fonts';
import { TeachersTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchTeachersPages2 } from '@/app/lib/data';

export default async function Page({
  searchParams,
  schoolName,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
  schoolName: string;
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchTeachersPages2(query, schoolName);

  // Handle the case where totalPages is undefined
  const totalPagesOrDefault = totalPages ?? 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Teachers</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search teachers..." />
        <CreateTeacher />
        <BulkImportTeachers />
      </div>
      <Suspense key={query + currentPage} fallback={<TeachersTableSkeleton />}>
        <Table query={query} currentPage={currentPage} schoolName={schoolName} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPagesOrDefault} />
      </div>
    </div>
  );
}

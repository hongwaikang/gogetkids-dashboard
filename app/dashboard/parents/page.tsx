import Pagination from '@/app/ui/parents/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/parents/table';
import { CreateParent } from '@/app/ui/parents/buttons';
import { lusitana } from '@/app/ui/fonts';
import { ParentsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchParentsPages } from '@/app/lib/data';

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

  const totalPages = await fetchParentsPages(query);

  // Handle the case where totalPages is undefined
  const totalPagesOrDefault = totalPages ?? 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Parents</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search parents..." />
        <CreateParent />
      </div>
      <Suspense key={query + currentPage} fallback={<ParentsTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPagesOrDefault} />
      </div>
    </div>
  );
}

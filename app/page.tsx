import GoGetKidsLogo from '@/app/ui/gogetkids-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
        <GoGetKidsLogo />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p
            className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            <strong>Welcome to GoGetKids.</strong> Simplify school pick-ups and enhance safety.
          </p>
          <p className="text-gray-600">
            Transform your school operations with GoGetKids. Our platform is designed to keep students safe, parents informed, and administrators in control.
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>✔️ Faster Dismissals</li>
            <li>✔️ Real-time Student Tracking</li>
            <li>✔️ Personalized Schedules</li>
            <li>✔️ Clear Communication</li>
            <li>✔️ Secure Access for Parents and Teachers</li>
            <li>✔️ And More...</li>
          </ul>
          <Link
            href="/signup"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Sign up here</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span>Login here</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}
          <div className="w-full max-w-screen-lg mx-auto">
            <Image
              src="/desktop2.png"
              width={1600}
              height={900}
              alt="Screenshots of the dashboard project showing desktop version"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

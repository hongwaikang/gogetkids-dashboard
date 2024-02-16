import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import React from 'react';
import GoGetKidsLogo from '@/app/ui/gogetkids-logo'; // Import the GoGetKidsLogo component
import { Button } from '@/app/ui/button';

export default function SignUpOptions() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <div className="mb-8">
        <GoGetKidsLogo darkFont={true} />
      </div>
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4 text-center`}>
          Choose an option to sign up:
        </h1>
        <div className="flex justify-center space-x-4">
          <Link href="/signup/school-admin">
            <Button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300">
              Sign Up as School Admin
            </Button>
          </Link>
          <Link href="/signup/transport-admin">
            <Button className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300">
              Sign Up as Transport Admin
            </Button>
          </Link>
        </div>
        <div className="text-center mt-4">
          <Link href="/login" className="text-blue-500 hover:underline">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}

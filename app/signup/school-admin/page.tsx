'use client';

import { lusitana } from '@/app/ui/fonts';
import { ArrowRightIcon, AtSymbolIcon, KeyIcon, AcademicCapIcon, PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import React, { useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/button';
import GoGetKidsLogo from '@/app/ui/gogetkids-logo'; // Import the GoGetKidsLogo component

export default function SignUpForm() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: '',
    password: '',
    firstname: '',
    lastname: '',
    school_name: '',
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onSignUp = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/users/signup', user);
      console.log('User signed up successfully', response.data);
      toast.success('Signup successful!');
      router.push('/login');
    } catch (error: any) {
      console.log('Failed to sign up user', error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      {/* Include the GoGetKidsLogo component here with darkFont prop */}
      <div className="mb-8"> {/* Adding margin bottom to create space between logo and form */}
        <GoGetKidsLogo darkFont={true} /> {/* Use darker font color for the logo */}
      </div>
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6 space-y-4">
        <h1 className={`${lusitana.className} text-2xl font-bold mb-4 text-center`}>
          {loading ? 'Processing' : 'Create an account to get started.'}
        </h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Signing up as a <span className="font-semibold text-blue-500">School Admin</span>
        </p>
        <div>
          <label className="block text-xs font-medium text-gray-900" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter email"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-900" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter password"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-900" htmlFor="firstname">
            First Name
          </label>
          <div className="relative">
            <input
              id="firstname"
              type="text"
              value={user.firstname}
              onChange={(e) => setUser({ ...user, firstname: e.target.value })}
              placeholder="Enter firstname"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-900" htmlFor="lastname">
            Last Name
          </label>
          <div className="relative">
            <input
              id="lastname"
              type="text"
              value={user.lastname}
              onChange={(e) => setUser({ ...user, lastname: e.target.value })}
              placeholder="Enter lastname"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <PencilIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-900" htmlFor="school_name">
            School Name
          </label>
          <div className="relative">
            <input
              id="school_name"
              type="text"
              value={user.school_name}
              onChange={(e) => setUser({ ...user, school_name: e.target.value })}
              placeholder="Enter School Name"
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
            <AcademicCapIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div className="flex justify-center"> {/* Center the sign-up button */}
          <Button
            onClick={onSignUp}
            disabled={buttonDisabled}
            className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300'}`}
          >
            {buttonDisabled ? 'Please enter sign up details' : 'Sign Up'} <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
          </Button>
        </div>
        <Link href="/login" className="block text-center text-blue-500 hover:underline">
          Visit Login Page
        </Link>
      </div>
    </div>
  );
}

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { connect } from '@/app/lib/dbConfig'; // Import the connect function

import bcrypt from 'bcrypt';

// Define the User type
type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNum: string;
  role: string;
  company_name: string;
};

async function getUser(email: string): Promise<User | null> {
  try {
    const client = await connect(); // Connect to MongoDB
    const db = client.db('GoGetKids');

    // Query the 'users' collection
    const user = await db.collection('users').findOne({ email });

    await client.close(); // Close the MongoDB connection

    // If no user found, return null
    if (!user) {
      return null;
    }

    // Check if the returned document conforms to the User type
    const validatedUser: User = {
      _id: user._id.toString(), // Convert ObjectId to string
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      phoneNum: user.phoneNum,
      role: user.role,
      company_name: user.company_name,
    };

    return validatedUser;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}


export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});

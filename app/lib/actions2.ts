'use server'

import { connect, disconnect } from './dbConfig'; // Import the connect and disconnect functions from dbConfig.ts
import { Db, ObjectId } from 'mongodb';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

// Define the schema for school admin data validation using Zod
const schoolAdminSchema = z.object({
  email: z.string().email(), // Email is required and must be a valid email format
  firstname: z.string(),
  lastname: z.string(),
  password: z.string(), // Password is required
  school_name: z.string(),
  role: z.enum(["school_admin"]), // Role must be "school_admin"
});

export async function createSchoolAdmin(formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Validate form data using Zod schema
    const validatedData = schoolAdminSchema.parse({
      email: formData.get('email'),
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      password: formData.get('password'),
      school_name: formData.get('school_name'),
      role: 'school admin',
    });

    // Check if the email is unique
    client = await connect(); // Connect to MongoDB using the connect function from dbConfig.ts
    const db: Db = client.db('test'); // Specify the database name here
    const existingAdmin = await db.collection('adminusers').findOne({ email: validatedData.email });
    if (existingAdmin) {
      throw new Error('Email is already in use.');
    }

    // Hash the password
    const saltRounds = 10; // Define salt rounds
    const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

    // Insert school admin data into the MongoDB collection with hashed password
    const result = await db.collection('adminusers').insertOne({
      ...validatedData,
      password: hashedPassword, // Replace plain password with hashed password
    });

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('School admin created successfully:', result.insertedId);
      revalidatePath('/system-admin-dashboard/school-admins');
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create school admin.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating school admin:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await disconnect(); // Disconnect from MongoDB using the disconnect function from dbConfig.ts
    }
  }
}

export async function updateSchoolAdmin(id: string, formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    // Validate form data using Zod schema
    const validatedData = schoolAdminSchema.parse({
      email: formData.get('email'),
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      password: formData.get('password'),
      school_name: formData.get('school_name'), // Assuming school_name is present in formData
      role: 'school admin', // Change role to "school admin"
    });

    client = await connect();
    const db = client.db('test'); // Specify the database name here

    // Update school admin data in the MongoDB collection
    const result = await db.collection('adminusers').updateOne(
      { _id: objectId },
      { $set: validatedData }
    );

    // Check if the update was successful
    if (result.modifiedCount === 1) {
      console.log('School admin updated successfully:', id);
      return { success: true };
    } else {
      console.error('Failed to update school admin.');
      return { success: false };
    }
  } catch (error: any) {
    // Handle validation or database update errors
    console.error('Error updating school admin:', error.message);
    return { success: false, errorMessage: error.message };
  } finally {
    // Close the connection
    if (client) {
      await disconnect(); // Disconnect from MongoDB using the disconnect function from dbConfig.ts
    }
  }
}



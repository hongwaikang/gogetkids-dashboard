'use server'

import { Db, ObjectId } from 'mongodb';
import { connect } from './dbConfig';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import toast from 'react-hot-toast';
import jwt from 'jsonwebtoken';
import { fetchSessionToken } from "@/app/lib/data";
import { fetchCompanyName } from './data3';

// For password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10;

// For token grabbing
const sessionName = 'currentSession';

export async function deleteVehicle(id: string) {
  let client;
  try {
    // Convert id to ObjectId
    const objectId = new ObjectId(id);

    client = await connect();
    const db = client.db('GoGetKids');

    // Delete the vehicle from the MongoDB collection
    const result = await db.collection('vehicles').deleteOne({ _id: objectId });

    // Check if the deletion was successful
    if (result.deletedCount === 1) {
      // Data deleted successfully
      console.log('Vehicle deleted successfully:', id);
      revalidatePath('/dashboard/vehicles');
      return { success: true }; // Return success message to client-side
    } else {
      // No document matched the query criteria, so nothing was deleted
      console.error('Vehicle not found:', id);
      return { success: false, errorMessage: 'Vehicle not found' }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle database deletion errors
    console.error('Error deleting vehicle:', error.message);
    toast.error('Failed to delete vehicle. Please try again.');
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Define the schema for vehicle data validation using Zod
const vehicleSchema = z.object({
  vehicleId: z.string(),
  status: z.string(),
  nextServicing: z.string(), // Updated to accept string values
  company_name: z.string(),
});

export async function createVehicle(formData: FormData): Promise<{ success: boolean, errorMessage?: string }> {
  let client;
  try {

    // Fetch session token
    const token = await fetchSessionToken(sessionName);
    if (!token) {
      throw new Error('Session token not found.');
    }

    // Decode the token to get school_name
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    const sessionUserid = decodedToken?.id;
    console.log(sessionUserid);

    // Extract company_name from decoded token
    const companyName = await fetchCompanyName(sessionUserid);
    console.log(companyName);

    // Validate form data using Zod schema
    const validatedData = vehicleSchema.parse({
      vehicleId: formData.get('vehicleId'),
      status: formData.get('status'),
      nextServicing: formData.get('nextServicing'),
      company_name: companyName,
    });

    // Connect to MongoDB
    client = await connect();
    const db = client.db('GoGetKids');

    // Insert vehicle data into the MongoDB collection
    const result = await db.collection('vehicles').insertOne(validatedData);

    // Check if the insertion was successful
    if (result.insertedId) {
      // Data inserted successfully
      console.log('Vehicle created successfully:', result.insertedId);
      toast.success('Vehicle created successfully');
      revalidatePath('/transport-admin-dashboard/vehicles')
      return { success: true }; // Return success message to client-side
    } else {
      // Error occurred during insertion
      console.error('Failed to create vehicle.');
      return { success: false }; // Return error message to client-side
    }
  } catch (error: any) {
    // Handle validation or database insertion errors
    console.error('Error creating vehicle:', error.message);
    return { success: false, errorMessage: error.message }; // Return error message to client-side
  } finally {
    // Close the connection
    if (client) {
      await client.close();
    }
  }
}
'use server'

import { Db, ObjectId } from 'mongodb';
import { connect } from './dbConfig';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import toast from 'react-hot-toast';
import jwt from 'jsonwebtoken';
import { fetchSessionToken } from "@/app/lib/data";

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
'use server'

import Papa from 'papaparse';
import { connect, disconnect } from './dbConfig';

interface Teacher {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNum: string;
  role: string;
  school_name: string;
}
/*
export async function parseCSV(file: File): Promise<Teacher[]> {
  console.log('Parsing CSV file...');

  return new Promise((resolve, reject) => {
    const teachers: Teacher[] = [];

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      step: (result) => {
        console.log('Row parsed:', result.data);

        const { email, firstName, lastName, password, phoneNum, role, school_name } = result.data as Teacher;
        teachers.push({ email, firstName, lastName, password, phoneNum, role, school_name });

        // Log the inserted row
        console.log('Inserted row:', { email, firstName, lastName, password, phoneNum, school_name });
      },
      complete: () => {
        console.log('CSV parsing complete');
        resolve(teachers); // Resolve with the array of teacher objects
      },
      error: (error) => {
        console.error('Error parsing CSV:', error.message);
        reject(error);
      },
    });
  });
} */

export async function parseJSON(jsonData: any): Promise<Teacher[]> {
  console.log('Parsing JSON data...');

  const parsedTeachers: Teacher[] = JSON.parse(jsonData);

  console.log('JSON parsing complete');

  return parsedTeachers;
}

export async function insertTeachersFromJSON(parsedTeachers: Teacher[]): Promise<void> {
  console.log('Inserting teachers into the database...');

  try {
    const client = await connect();
    const database = client.db('GoGetKids');
    const teachersCollection = database.collection('users');

    await teachersCollection.insertMany(parsedTeachers.map(teacher => ({
      ...teacher,
      role: 'teacher', // Add role field with value 'teacher'
    })));

    console.log('Teachers inserted successfully');
  } catch (error) {
    console.error('Error inserting teachers:', error);
    throw error;
  } finally {
    await disconnect();
  }
}

export async function parseCSVToJSON(csvData: string): Promise<Teacher[]> {
  console.log('Parsing CSV data to JSON...');

  const parsedTeachers: Teacher[] = [];

  const results = Papa.parse(csvData, { header: true });

  if (results && results.data && results.data.length > 0) {
    for (const data of results.data) {
      // Assuming CSV file headers match the Teacher interface properties
      const { email, firstName, lastName, password, phoneNum, role, school_name } = data as any;
      const teacher: Teacher = {
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        password: password || '',
        phoneNum: phoneNum || '',
        role: role || '',
        school_name: school_name || ''
      };
      parsedTeachers.push(teacher);
    }
    console.log('CSV parsing complete');
    return parsedTeachers;
  } else {
    throw new Error('CSV data is empty or invalid.');
  }
}

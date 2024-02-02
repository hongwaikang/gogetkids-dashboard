// csvParser.ts
import Papa from 'papaparse';
import { createPool, sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
//import bcrypt from 'bcrypt';

const saltRounds = 10;

export async function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          reject(result.errors[0].message);
        } else {
          resolve(result.data);
        }
      },
      error: (error) => {
        reject(error.message);
      },
    });
  });
}

export async function parseCSV2(file: File): Promise<void> {
  const teachers: string[][] = [];

  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      step: (result) => {
        const row: string[] = Object.values(result.data as Record<string, string>);
        teachers.push(row.map(String)); // Ensure all values are stored as strings
      },
      complete: () => {
        console.log('Parsed teachers array:', teachers);
        console.log('CSV parsing complete');
        resolve();
      },
      error: (error) => {
        console.error('Error parsing CSV:', error.message);
        reject(error.message);
      },
    });
  });
}

export async function parseCSVandInsertTeachers(file: File): Promise<void> {
  // Create a connection pool
  const pool = createPool({
    connectionString: process.env.POSTGRES_URL || "postgres://default:DAE7NCBvhP9V@ep-rough-unit-92773982-pooler.us-east-1.postgres.vercel-storage.com:5432/verceldb",
  });

  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      step: async (result) => {
        try {
          // Extracting teacher information from each row
          const { username, password, firstname, lastname, country_code, phone } = result.data as {
            username: string;
            password: string;
            firstname: string;
            lastname: string;
            country_code: string;
            phone: string;
          };

          // Hash the password using bcrypt
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          // Insert data into the database
          await pool.sql`
            INSERT INTO teachers (username, password, firstname, lastname, country_code, phone)
            VALUES (${username}, ${hashedPassword}, ${firstname}, ${lastname}, ${country_code}, ${phone})
          `;
        } catch (error) {
          console.error('Error inserting teacher:', error);
          reject(error); // Reject if there's an error during teacher insertion
        }
      },
      complete: () => {
        console.log('CSV parsing and teacher insertion complete');
        // Close the pool after completing the operation
        pool.end();
        resolve(); // Resolve once the CSV parsing and teacher insertion are complete
      },
      error: (error) => {
        console.error('Error parsing CSV:', error.message);
        // Close the pool in case of an error
        pool.end();
        reject(error.message); // Reject if there's an error during CSV parsing
      },
    });
  });
}

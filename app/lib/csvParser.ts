import Papa from 'papaparse';

interface Teacher {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNum: string;
  role: string;
  school_name: string;
}

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
}

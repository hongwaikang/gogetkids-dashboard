import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  User,
  Revenue,
  StudentsTable,
  ParentsTable,
  TeachersTable,
  StudentForm,
  ParentForm,
  TeacherForm,
  ClassesTable,
  ClassForm,
  Teacher,
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import Papa from 'papaparse';

const ITEMS_PER_PAGE = 6;

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log('Fetching revenue data...');
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    // console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();

  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();

  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  noStore();

  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  noStore();

  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    console.log(invoice); // Invoice is an empty array []
    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  noStore();

  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

// Students

export async function fetchFilteredStudents(query: string, currentPage: number) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const students = await sql<StudentsTable>`
      SELECT
        students.id,
        students.firstname,
        students.lastname,
        students.class_id,
        students.parent_id,
        CONCAT(students.firstname, ' ', students.lastname) AS name,
        CONCAT(parents.firstname, ' ', parents.lastname) AS parent_name
      FROM students
      LEFT JOIN parents ON students.parent_id::VARCHAR = parents.id::VARCHAR
      WHERE
        students.firstname ILIKE ${`%${query}%`} OR
        students.lastname ILIKE ${`%${query}%`} OR
        students.class_id ILIKE ${`%${query}%`} OR
        students.parent_id::VARCHAR ILIKE ${`%${query}%`} OR
        CONCAT(students.firstname, ' ', students.lastname) ILIKE ${`%${query}%`} OR
        CONCAT(parents.firstname, ' ', parents.lastname) ILIKE ${`%${query}%`}
      ORDER BY name
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return students.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch students.');
  }
}

export async function fetchStudentsPages(query: string) {
  noStore();

  try {
    const count = await sql`SELECT COUNT(*)
      FROM students
      WHERE
        students.firstname ILIKE ${`%${query}%`} OR
        students.lastname ILIKE ${`%${query}%`} OR
        students.class_id ILIKE ${`%${query}%`} OR
        students.parent_id::VARCHAR ILIKE ${`%${query}%`} OR
        CONCAT(students.firstname, ' ', students.lastname) ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of students.');
  }
}

export async function fetchStudentById(id: string) {
  noStore();

  try {
    const data = await sql<StudentForm>`
      SELECT
        students.id,
        students.firstname,
        students.lastname,
        students.dateofbirth,
        students.address,
        students.postalcode,
        students.class_id,
        students.parent_id
      FROM students
      WHERE students.id = ${id};
    `;

    // Extract the first row from the result
    const student = data.rows[0];

    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch student.');
  }
}

// Parents
export async function fetchFilteredParents(query: string, currentPage: number) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE; // Assuming ITEMS_PER_PAGE is defined somewhere

  try {
    const parents = await sql<ParentsTable>`
      SELECT
        parents.id,
        parents.firstname,
        parents.lastname,
        parents.country_code,
        parents.phone,
        parents.username,
        CONCAT(parents.firstname, ' ', parents.lastname) AS name
      FROM parents
      WHERE
        parents.firstname ILIKE ${`%${query}%`} OR
        parents.lastname ILIKE ${`%${query}%`} OR
        parents.country_code ILIKE ${`%${query}%`} OR
        parents.phone ILIKE ${`%${query}%`} OR
        parents.username ILIKE ${`%${query}%`} OR
        CONCAT(parents.firstname, ' ', parents.lastname) ILIKE ${`%${query}%`}
      ORDER BY name
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return parents.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch parents.');
  }
}

export async function fetchParentsPages(query: string) {
  noStore();

  try {
    const count = await sql`SELECT COUNT(*)
      FROM parents
      WHERE
        parents.firstname ILIKE ${`%${query}%`} OR
        parents.lastname ILIKE ${`%${query}%`} OR
        parents.country_code ILIKE ${`%${query}%`} OR
        parents.phone ILIKE ${`%${query}%`} OR
        parents.username ILIKE ${`%${query}%`} OR
        CONCAT(parents.firstname, ' ', parents.lastname) ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of parents.');
  }
}

export async function fetchParentById(id: string) {
  noStore();

  try {
    const data = await sql<ParentForm>`
      SELECT
        parents.id,
        parents.username,
        parents.password,
        parents.firstname,
        parents.lastname,
        parents.country_code,
        parents.phone
      FROM parents
      WHERE parents.id = ${id};
    `;

    // Extract the first row from the result
    const parent = data.rows[0];

    if (!parent) {
      throw new Error('Parent not found');
    }

    return parent;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch parent.');
  }
}

// Teachers
export async function fetchFilteredTeachers(query: string, currentPage: number) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE; // Assuming ITEMS_PER_PAGE is defined somewhere

  try {
    const teachers = await sql<TeachersTable>`
      SELECT
        teachers.id,
        teachers.firstname,
        teachers.lastname,
        teachers.username,
        teachers.country_code,
        teachers.phone,
        CONCAT(teachers.firstname, ' ', teachers.lastname) AS name
      FROM teachers
      WHERE
        teachers.firstname ILIKE ${`%${query}%`} OR
        teachers.lastname ILIKE ${`%${query}%`} OR
        teachers.username ILIKE ${`%${query}%`} OR
        teachers.country_code ILIKE ${`%${query}%`} OR
        teachers.phone ILIKE ${`%${query}%`} OR
        CONCAT(teachers.firstname, ' ', teachers.lastname) ILIKE ${`%${query}%`}
      ORDER BY name
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return teachers.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch teachers.');
  }
}

export async function fetchTeachersPages(query: string) {
  noStore();

  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM teachers
      WHERE
        teachers.firstname ILIKE ${`%${query}%`} OR
        teachers.lastname ILIKE ${`%${query}%`} OR
        teachers.username ILIKE ${`%${query}%`} OR
        teachers.country_code ILIKE ${`%${query}%`} OR
        teachers.phone ILIKE ${`%${query}%`} OR
        CONCAT(teachers.firstname, ' ', teachers.lastname) ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of teachers.');
  }
}

export async function fetchTeacherById(id: string) {
  noStore();

  try {
    const data = await sql<TeacherForm>`
      SELECT
        teachers.id,
        teachers.username,
        teachers.password,
        teachers.firstname,
        teachers.lastname,
        teachers.country_code,
        teachers.phone
      FROM teachers
      WHERE teachers.id = ${id};
    `;

    // Extract the first row from the result
    const teacher = data.rows[0];

    if (!teacher) {
      throw new Error('Teacher not found');
    }

    return teacher;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch teacher.');
  }
}

// Classes
export async function fetchFilteredClasses(query: string, currentPage: number) {
  noStore();

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const classes = await sql<ClassesTable>`
      SELECT
        classes.id,
        classes.name,
        classes.level,
        classes.teacher_id,
        CONCAT(teachers.firstname, ' ', teachers.lastname) AS teacher_name
      FROM classes
      LEFT JOIN teachers ON classes.teacher_id::VARCHAR = teachers.id::VARCHAR
      WHERE
        classes.name ILIKE ${`%${query}%`} OR
        classes.level ILIKE ${`%${query}%`} OR
        classes.teacher_id::VARCHAR ILIKE ${`%${query}%`}
      ORDER BY name
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return classes.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch classes.');
  }
}

export async function fetchClassesPages(query: string) {
  noStore();

  try {
    const count = await sql`SELECT COUNT(*)
      FROM classes
      WHERE
        id ILIKE ${`%${query}%`} OR
        name ILIKE ${`%${query}%`} OR
        level ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of classes.');
  }
}

export async function fetchClassById(id: string) {
  noStore();

  try {
    const data = await sql<ClassForm>`
      SELECT
        classes.id,
        classes.name,
        classes.level,
        classes.teacher_id
      FROM classes
      WHERE classes.id = ${id};
    `;

    // Extract the first row from the result
    const class1 = data.rows[0];

    if (!class1) {
      throw new Error('Class not found');
    }

    return class1;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch class.');
  }
}

// Example structure for CSV parsing function
/*
export async function parseTeacherCSV(file: File): Promise<Teacher[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false, // Assume no header in the CSV
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          reject(result.errors[0].message);
        } else {
          const teacherData: Teacher[] = result.data.map((row) => {
            const typedRow = row as unknown[];

            if (typedRow.length !== 6) {
              throw new Error('Invalid CSV structure');
            }

            const [firstname, lastname, username, password, country_code, phone] = typedRow as [
              string,
              string,
              string,
              string,
              string,
              string
            ];

            return {
              id: '',
              firstname,
              lastname,
              username,
              password,
              country_code,
              phone,
            };
          });

          resolve(teacherData);
        }
      },
      error: (error) => {
        reject(error.message);
      },
    });
  });
}
*/

export async function parseTeacherCSV(file: File): Promise<Teacher[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false, // Assume no header in the CSV
      skipEmptyLines: true,
      complete: (result) => {
        console.log('PapaParse complete callback executed');
        if (result.errors.length > 0) {
          console.error('Error in CSV parsing:', result.errors[0].message);
          reject(result.errors[0].message);
        } else {
          try {
            const teacherData: Teacher[] = result.data.map((row: any, index: number) => {
              if (!(row instanceof Array) || row.length !== 6) {
                throw new Error(`Invalid CSV structure in row ${index + 1}`);
              }

              const [firstname, lastname, username, password, country_code, phone] = row;

              return {
                id: '', // Empty string for the id
                firstname,
                lastname,
                username,
                password,
                country_code,
                phone,
              };
            });

            console.log('Parsed teacher data:', teacherData);
            resolve(teacherData);
          } catch (error) {
            if (error instanceof Error) {
              console.error('Error processing parsed data:', error.message);
              reject(error.message);
            } else {
              console.error('Unknown error processing parsed data:', error);
              reject('Unknown error');
            }
          }
        }
      },
      error: (error) => {
        console.error('Error in PapaParse:', error.message);
        reject(error.message);
      },
    });
  });
}
'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// For password hashing
const bcrypt = require('bcrypt');
const saltRounds = 10; // Adjust the number of salt rounds as needed

// ---------------------------INVOICE--------------------------------------------
// For Form validation
const InvoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce.number()
  .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// Create Invoice
const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

// This is temporary until @types/react-dom is updated
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Create Invoice
export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Update Invoice
const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Delete Invoice
export async function deleteInvoice(id: string) {

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
    return { message: 'Deleted Invoice.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Invoice.' };
  }
}

// -------------------------------------------------------------------------------------

// ------------------------------------STUDENT-----------------------------------------
// For Form validation
const StudentFormSchema = z.object({
  id: z.string(),
  firstname: z.string({
    invalid_type_error: 'Please enter a valid first name.',
  }),
  lastname: z.string({
    invalid_type_error: 'Please enter a valid last name.',
  }),
  dateofbirth: z.string({
    invalid_type_error: 'Please enter a valid date of birth.',
  }),
  address: z.string({
    invalid_type_error: 'Please enter a valid address.',
  }),
  postalcode: z.string({
    invalid_type_error: 'Please enter a valid postal code.',
  }),
  class_id: z.string({
    invalid_type_error: 'Please select a valid class.',
  }),
  parent_id: z.string({
    invalid_type_error: 'Please select a valid parent.',
  }),
});

// Create Student
const CreateStudent = StudentFormSchema.omit({ id: true});

export async function createStudent(formData: FormData) {
  const {firstname, lastname, dateofbirth, postalcode, address, class_id, parent_id } = CreateStudent.parse({
    //id: formData.get('id'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    dateofbirth: formData.get('dateofbirth'),
    address: formData.get('address'),
    postalcode: formData.get('postalcode'),
    class_id: formData.get('class_id'),
    parent_id: formData.get('parent_id'),
  });

  // Store data into the database
  await sql`
    INSERT INTO students (firstname, lastname, dateofbirth, address, postalcode, class_id, parent_id)
    VALUES (${firstname}, ${lastname}, ${dateofbirth}, ${address}, ${postalcode}, ${class_id}, ${parent_id})
  `;

  // Refresh data and redirect back to the students page
  revalidatePath('/dashboard/students');
  redirect('/dashboard/students');
}

// Update Student
const UpdateStudent = StudentFormSchema.omit({ id: true});;

export async function updateStudent(student_id: string, formData: FormData) {
  const {firstname, lastname, dateofbirth, address, postalcode, class_id, parent_id } = UpdateStudent.parse({
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    dateofbirth: formData.get('dateofbirth'),
    address: formData.get('address'),
    postalcode: formData.get('postalcode'),
    class_id: formData.get('class_id'),
    parent_id: formData.get('parent_id'),
  });

  try {
    await sql`
    UPDATE students
    SET
      firstname = ${firstname},
      lastname = ${lastname},
      dateofbirth = ${dateofbirth},
      address = ${address},
      postalcode = ${postalcode},
      class_id = ${class_id},
      parent_id = ${parent_id}
    WHERE id = ${student_id}
  `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Student.' };
  }

  revalidatePath('/dashboard/students');
  redirect('/dashboard/students');
}
// -----------------------------------------------------------------------------------

// ------------------------------------PARENT-----------------------------------
// For Form validation
const ParentFormSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  country_code: z.string(),
  phone: z.string(),
});

// Create Parent
const CreateParent = ParentFormSchema.omit({ id: true});

export async function createParent(formData: FormData) {
  const {username, password, firstname, lastname, country_code, phone } = CreateParent.parse({
    //id: formData.get('id'),
    username: formData.get('username'),
    password: formData.get('password'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    country_code: formData.get('country_code'),
    phone: formData.get('phone'),
  });

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Store data into the database
  await sql`
    INSERT INTO parents (username, password, firstname, lastname, country_code, phone)
    VALUES (${username}, ${hashedPassword}, ${firstname}, ${lastname}, ${country_code} ,${phone})
  `;

  // Refresh data and redirect back to the parents page
  revalidatePath('/dashboard/parents');
  redirect('/dashboard/parents');
}
// -----------------------------------------------------------------------------------

// Update Parent
const UpdateParent = ParentFormSchema.omit({ id: true});

export async function updateParent(parent_id: string, formData: FormData) {
  const {username, password, firstname, lastname, country_code, phone } = UpdateParent.parse({
    //id: formData.get('id'),
    username: formData.get('username'),
    password: formData.get('password'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    country_code: formData.get('country_code'),
    phone: formData.get('phone'),
  });

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await sql`
    UPDATE parents
    SET
      username = ${username},
      password = ${hashedPassword},
      firstname = ${firstname},
      lastname = ${lastname},
      country_code = ${country_code},
      phone = ${phone}
    WHERE id = ${parent_id}
  `;

  revalidatePath('/dashboard/parents');
  redirect('/dashboard/parents');
}
// ----------------------------------------------------------------------------------

// ------------------------------------TEACHER---------------------------------
// For Form validation
const TeacherFormSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  country_code: z.string(),
  phone: z.string(),
});

// Create Teacher
const CreateTeacher = TeacherFormSchema.omit({ id: true });

export async function createTeacher(formData: FormData) {
  const { username, password, firstname, lastname, country_code, phone} = CreateTeacher.parse({
    //id: formData.get('id'),
    username: formData.get('username'),
    password: formData.get('password'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    country_code: formData.get('country_code'),
    phone: formData.get('phone'),
  });

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Store data into the database with the hashed password
  await sql`
    INSERT INTO teachers (username, password, firstname, lastname, country_code, phone)
    VALUES (${username}, ${hashedPassword}, ${firstname}, ${lastname}, ${country_code}, ${phone})
  `;

  // Refresh data and redirect back to the teachers page
  revalidatePath('/dashboard/teachers');
  redirect('/dashboard/teachers');
}


// Update Teacher
const UpdateTeacher = TeacherFormSchema.omit({ id: true});

export async function updateTeacher(teacher_id: string, formData: FormData) {
  const {username, password, firstname, lastname, country_code, phone} = UpdateTeacher.parse({
    //id: formData.get('id'),
    username: formData.get('username'),
    password: formData.get('password'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    country_code: formData.get('country_code'),
    phone: formData.get('phone'),
  });

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await sql`
    UPDATE teachers
    SET
      username = ${username},
      password = ${hashedPassword},
      firstname = ${firstname},
      lastname = ${lastname},
      country_code = ${country_code},
      phone = ${phone}
    WHERE id = ${teacher_id}
  `;

  revalidatePath('/dashboard/teachers');
  redirect('/dashboard/teachers');
}

// Classes
const ClassFormSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.string(),
  teacher_id: z.string()
});

// Create Class
const CreateClass = ClassFormSchema;

export async function createClass(formData: FormData) {
  const {id, name, level, teacher_id} = CreateClass.parse({
    id: formData.get('id'),
    name: formData.get('name'),
    level: formData.get('level'),
    teacher_id: formData.get('teacher_id'),
  });

  // Store data into the database
  await sql`
    INSERT INTO classes (id, name, level, teacher_id)
    VALUES (${id}, ${name}, ${level}, ${teacher_id})
  `;

  // Refresh data and redirect back to the parents page
  revalidatePath('/dashboard/classes');
  redirect('/dashboard/classes');
}

// Update Class
const UpdateClass = ClassFormSchema;

export async function updateClass(class_id: string, formData: FormData) {
  const {name, level, teacher_id} = UpdateClass.parse({
    //id: formData.get('id'),
    name: formData.get('name'),
    level: formData.get('level'),
    teacher_id: formData.get('teacher_id'),
  });

  await sql`
    UPDATE classes
    SET
      name = ${name},
      level = ${level},
      teacher_id = ${teacher_id}
    WHERE id = ${class_id}
  `;

  revalidatePath('/dashboard/classes');
  redirect('/dashboard/classes');
}

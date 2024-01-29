'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
const CreateStudent = StudentFormSchema;

// This is temporary until @types/react-dom is updated
export type StudentState = {
  errors?: {
    id?: string[];
    firstname?: string[];
    lastname?: string[];
    dateofbirth?: string[];
    address?: string[];
    postalcode?: string[];
    class_id?: string[];
    parent_id?: string[];
  };
  message?: string | null;
};

export async function createStudent(formData: FormData) {
  const { id, firstname, lastname, dateofbirth, postalcode, address, class_id, parent_id } = CreateStudent.parse({
    id: formData.get('id'),
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
    INSERT INTO students (id, firstname, lastname, dateofbirth, address, postalcode, class_id, parent_id)
    VALUES (${id}, ${firstname}, ${lastname}, ${dateofbirth}, ${address}, ${postalcode}, ${class_id}, ${parent_id})
  `;

  // Refresh data and redirect back to the students page
  revalidatePath('/dashboard/students');
  redirect('/dashboard/students');
}

// Update Student
const UpdateStudent = StudentFormSchema;

export async function updateStudent(student_id: string, formData: FormData) {
  const { id, firstname, lastname, dateofbirth, address, postalcode, class_id, parent_id } = UpdateStudent.parse({
    id: formData.get('id'),
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
    WHERE id = ${id}
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
  phone: z.string(),
});

// Create Parent
const CreateParent = ParentFormSchema;

export async function createParent(formData: FormData) {
  const { id, username, password, firstname, lastname, phone } = CreateParent.parse({
    id: formData.get('id'),
    username: formData.get('username'),
    password: formData.get('password'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    phone: formData.get('phone'),
  });

  // Store data into the database
  await sql`
    INSERT INTO parents (id, username, password, firstname, lastname, phone)
    VALUES (${id}, ${username}, ${password}, ${firstname}, ${lastname}, ${phone})
  `;

  // Refresh data and redirect back to the parents page
  revalidatePath('/dashboard/parents');
  redirect('/dashboard/parents');
}
// -----------------------------------------------------------------------------------

// Update Parent
const UpdateParent = ParentFormSchema


export async function updateParent(parent_id: string, formData: FormData) {
  const { id, username, password, firstname, lastname, phone } = UpdateParent.parse({
    id: formData.get('id'),
    username: formData.get('username'),
    password: formData.get('password'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    phone: formData.get('phone'),
  });

  await sql`
    UPDATE parents
    SET
      username = ${username},
      password = ${password},
      firstname = ${firstname},
      lastname = ${lastname},
      phone = ${phone}
    WHERE id = ${id}
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
  phone: z.string(),
  class_id: z.string(),
});

// Create Teacher
const CreateTeacher = TeacherFormSchema;

export async function createTeacher(formData: FormData) {
  const { id, username, password, firstname, lastname, phone, class_id} = CreateTeacher.parse({
    id: formData.get('id'),
    username: formData.get('username'),
    password: formData.get('password'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    phone: formData.get('phone'),
    class_id: formData.get('class_id'),
  });

  // Store data into the database
  await sql`
    INSERT INTO teachers (id, username, password, firstname, lastname, phone, class_id)
    VALUES (${id}, ${username}, ${password}, ${firstname}, ${lastname}, ${phone}, ${class_id})
  `;

  // Refresh data and redirect back to the parents page
  revalidatePath('/dashboard/teachers');
  redirect('/dashboard/teachers');
}

// Update Teacher
const UpdateTeacher = TeacherFormSchema

export async function updateTeacher(teacher_id: string, formData: FormData) {
  const { id, username, password, firstname, lastname, phone, class_id } = UpdateTeacher.parse({
    id: formData.get('id'),
    username: formData.get('username'),
    password: formData.get('password'),
    firstname: formData.get('firstname'),
    lastname: formData.get('lastname'),
    phone: formData.get('phone'),
    class_id: formData.get('class_id'),
  });

  await sql`
    UPDATE teachers
    SET
      username = ${username},
      password = ${password},
      firstname = ${firstname},
      lastname = ${lastname},
      phone = ${phone},
      class_id = ${class_id}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/teachers');
  redirect('/dashboard/teachers');
}

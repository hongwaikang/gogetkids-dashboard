'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// For Form validation
const InvoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

// Create Invoice
const CreateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Store data into database
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    // Refresh data and redirect back to invoices page
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

// For Form validation
const StudentFormSchema = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  dateofbirth: z.string(),
  address: z.string(),
  postalcode: z.string(),
  class_id: z.string(),
  parent_id: z.string(),
});

// Create Student
const CreateStudent = StudentFormSchema;

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

// Update Invoice
// Use Zod to update the expected types
const UpdateInvoice = InvoiceFormSchema.omit({ id: true, date: true });

// ...

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;

  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Use Zod to update the expected types
const UpdateStudent = StudentFormSchema

// Update Student
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

  revalidatePath('/dashboard/students');
  redirect('/dashboard/students');
}

// Use Zod to update the expected types
const UpdateParent = ParentFormSchema

// Update Parent
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

// Use Zod to update the expected types
const UpdateTeacher = TeacherFormSchema

// Update Teacher
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

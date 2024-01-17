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
  gender: z.enum(['Male', 'Female']),
  DOB: z.string(),
  postalcode: z.string(),
  zone: z.enum(['North', 'South', 'East', 'West', 'City']),
  address: z.string(),
  class_id: z.string(),
  parent_id: z.string(),
});

// Create Student
const CreateStudent = StudentFormSchema;

export async function createStudent(formData: FormData) {
    const { id, firstname, lastname, gender, DOB, postalcode, zone, address, class_id, parent_id } = CreateStudent.parse({
      id: formData.get('id'),
      firstname: formData.get('firstname'),
      lastname: formData.get('lastname'),
      gender: formData.get('gender'),
      DOB: formData.get('DOB'),
      postalcode: formData.get('postalcode'),
      zone: formData.get('zone'),
      address: formData.get('address'),
      class_id: formData.get('class_id'),
      parent_id: formData.get('parent_id'),
    });

    // Store data into database
    await sql`
        INSERT INTO students (id, firstname, lastname, gender, DOB, postalcode, zone, address, class_id, parent_id)
        VALUES (${id}, ${firstname}, ${lastname}, ${gender}, ${DOB}, ${postalcode}, ${zone}, ${address}, ${class_id}, ${parent_id})
    `;

    // Refresh data and redirect back to invoices page
    revalidatePath('/dashboard/students');
    redirect('/dashboard/students');
}



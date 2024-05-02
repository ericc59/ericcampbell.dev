'use server';

import { auth } from 'app/auth';
import { type Session } from 'next-auth';
import prisma from './prisma';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { view_types } from '@prisma/client';

export async function increment(slug: string, type: view_types) {
  noStore();

  await prisma.views.upsert({
    where: {
      slug: slug,
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      type,
      slug: slug,
      count: 1,
    },
  });
}

async function getSession(): Promise<Session> {
  let session = await auth();
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }

  return session;
}

export async function saveGuestbookEntry(formData: FormData) {
  let session = await getSession();
  let email = session.user?.email as string;
  let createdBy = session.user?.name as string;

  if (!session.user) {
    throw new Error('Unauthorized');
  }

  let entry = formData.get('entry')?.toString() || '';
  let body = entry.slice(0, 500);

  await prisma.guestbook.create({
    data: {
      email: email,
      body: body,
      createdBy,
      createdAt: new Date(),
    },
  });

  revalidatePath('/guestbook');

  // let data = await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${process.env.RESEND_SECRET}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     from: 'guestbook@ericcampbell.dev',
  //     to: 'ericcampbell59@gmail.com',
  //     subject: 'New Guestbook Entry',
  //     html: `<p>Email: ${email}</p><p>Message: ${body}</p>`,
  //   }),
  // });

  // let response = await data.json();
  // console.log('Email sent', response);
}

export async function deleteGuestbookEntries(selectedEntries: string[]) {
  let session = await getSession();
  let email = session.user?.email as string;

  if (email !== 'ericcampbell59@gmail.com') {
    throw new Error('Unauthorized');
  }

  let selectedEntriesAsNumbers = selectedEntries.map(Number);

  await prisma.guestbook.deleteMany({
    where: {
      id: {
        in: selectedEntriesAsNumbers,
      },
    },
  });

  revalidatePath('/admin');
  revalidatePath('/guestbook');
}

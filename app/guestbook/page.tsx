import { auth } from 'app/auth';
import { getGuestbookEntries } from 'app/db/queries';
import { SignIn, SignOut } from './buttons';
import { Suspense } from 'react';
import Form from './form';

export const metadata = {
  title: 'Guestbook',
  description: 'Sign my guestbook and leave your mark.',
};

export default function GuestbookPage() {
  return (
    <section className="space-y-12">
      <div>
        <span className="text-[10px] text-zinc-600 uppercase tracking-[0.15em]">
          Guestbook
        </span>
        <h1 className="text-zinc-200 text-lg font-medium mt-3">
          Sign the Guestbook
        </h1>
      </div>
      <Suspense>
        <GuestbookForm />
        <GuestbookEntries />
      </Suspense>
    </section>
  );
}

async function GuestbookForm() {
  let session = await auth();

  return session?.user ? (
    <>
      <Form />
      <SignOut />
    </>
  ) : (
    <SignIn />
  );
}

async function GuestbookEntries() {
  let entries = await getGuestbookEntries();

  if (entries.length === 0) {
    return null;
  }

  return entries.map((entry) => (
    <div key={entry.id} className="flex flex-col space-y-1 mb-4">
      <div className="w-full text-xs break-words">
        <span className="text-zinc-600 mr-1">
          {entry.createdBy}:
        </span>
        <span className="text-zinc-400">{entry.body}</span>
      </div>
    </div>
  ));
}

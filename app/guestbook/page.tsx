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
    <section className="space-y-16">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-copper uppercase tracking-[0.2em]">
            Guestbook
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-copper/20 to-transparent" />
        </div>
        <h1 className="font-display text-4xl lg:text-5xl tracking-tight">
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
      <div className="w-full text-sm break-words">
        <span className="text-ash mr-1">
          {entry.createdBy}:
        </span>
        <span className="text-sand">{entry.body}</span>
      </div>
    </div>
  ));
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-black border border-black p-5 rounded-2xl">
      {children}
    </div>
  );
}

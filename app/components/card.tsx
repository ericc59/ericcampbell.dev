export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-black p-5 rounded-2xl">
      {children}
    </div>
  );
}

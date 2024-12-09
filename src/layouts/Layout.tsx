export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen pb-20 gap-16 font-kaisei`}>{children}</div>
  );
}

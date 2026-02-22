export default function PublicLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
}
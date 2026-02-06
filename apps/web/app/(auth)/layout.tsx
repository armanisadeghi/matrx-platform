/**
 * Auth Layout
 *
 * Centered layout for login/register pages.
 * No navigation chrome — clean, focused auth experience.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-secondary p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

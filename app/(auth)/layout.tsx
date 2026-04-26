import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
            <span className="text-sm font-bold text-white">AHW</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            AWH TECH
          </span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
      <footer className="text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} AWH TECH. All rights reserved.
      </footer>
    </div>
  );
}

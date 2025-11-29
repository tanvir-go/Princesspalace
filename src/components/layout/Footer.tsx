
import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold text-white mb-4">
            <Image src="/Plogo.png" alt="Princess Palace Logo" width={180} height={50} />
          </Link>
          <p className="text-sm max-w-xs text-center">
            A comprehensive Restaurant Management System.
          </p>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Princesspalace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

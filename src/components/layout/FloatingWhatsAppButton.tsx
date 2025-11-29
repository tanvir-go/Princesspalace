
'use client';

import Link from 'next/link';

export function FloatingWhatsAppButton() {
  const phoneNumber = '01646497530';
  const message = "Hello, I'm interested in Princess Palace. Can you help me?";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M16.75 13.96c.27.13.43.25.5.38.07.13.07.75.02.88-.05.13-1.12.88-1.57.88-.45 0-1.12-.19-1.92-.62-.79-.44-2.38-2-3.63-3.63-.5-.62-1-1.25-1-1.62 0-.38.44-.94.62-1.13.19-.18.38-.18.56 0l.5.5c.18.18.31.44.38.62.06.19.06.31 0 .44l-.19.44c-.06.13-.25.31-.12.5.12.19.75 1.13 1.5 1.88.75.75 1.63 1.38 1.88 1.5.19.13.31-.06.44-.12l.44-.19c.12-.06.25-.06.44 0l.5.5z" />
        <path d="M19.07 4.93A10 10 0 0 0 12 2 10 10 0 0 0 2 12c0 1.86.5 3.58 1.38 5.09L2.06 22l5.09-1.32A9.92 9.92 0 0 0 12 22a10 10 0 0 0 10-10 10 10 0 0 0-2.93-7.07zm-1.61 11.55a8.38 8.38 0 0 1-11.55-1.61 8.38 8.38 0 0 1-1.61-11.55 8.38 8.38 0 0 1 11.55 1.61 8.38 8.38 0 0 1 1.61 11.55z" />
      </svg>
    </Link>
  );
}

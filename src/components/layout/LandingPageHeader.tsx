
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu as MenuIcon, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartProvider';
import { CartDrawer } from '../cart/CartDrawer';

const navLinks = [
  { href: "/#menu", text: "Foods" },
  { href: "/#reservation", text: "Book Reservation" },
  { href: "/#party-booking", text: "Book Party Center" },
];

export function LandingPageHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/Plogo.png" alt="Princess Palace Logo" width={140} height={40} />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-2 text-sm font-medium md:flex md:space-x-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} scroll={true} className="transition-colors hover:text-foreground/80 text-foreground/60">
              {link.text}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-2 md:flex">
           <Button variant="outline" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Open Cart</span>
                 {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                )}
            </Button>
           <Button asChild size="sm">
              <Link href="/login">Login</Link>
           </Button>
           <Button asChild variant="secondary" size="sm">
              <Link href="/register">Register</Link>
           </Button>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
           <Button variant="outline" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Open Cart</span>
                 {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                )}
            </Button>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link href="/" className="flex items-center space-x-2 mb-4">
                  <Image src="/Plogo.png" alt="Princess Palace Logo" width={140} height={40} />
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {link.text}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-4">
                 <Button asChild size="lg" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/login">Login</Link>
                 </Button>
                 <Button asChild variant="secondary" size="lg" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/register">Register</Link>
                 </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
      </div>
    </header>
  );
}


import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');

  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl px-4">
        <p className="font-body text-accent uppercase tracking-[0.2em]">Chinese Restaurant & Party Center</p>
        <h1 className="font-headline text-5xl md:text-7xl font-bold leading-tight">
          Princess Palace
        </h1>
        <p className="text-lg md:text-xl text-gray-200">
          A dining experience that combines timeless elegance with modern culinary excellence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/#menu" scroll={true}>View Menu</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
            <Link href="/#reservation">Book a Table</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

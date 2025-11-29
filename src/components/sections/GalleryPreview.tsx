import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function GalleryPreview() {
    const galleryImages = PlaceHolderImages.filter(p => p.id.startsWith('gallery-')).slice(0, 4);

    return (
        <section className="bg-secondary/30">
            <div className="grid grid-cols-2 md:grid-cols-4">
                {galleryImages.map((image, index) => (
                    <div key={image.id} className="relative aspect-square group overflow-hidden">
                        <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                            data-ai-hint={image.imageHint}
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
                    </div>
                ))}
            </div>
             <div className="bg-primary text-primary-foreground py-16 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold">A Feast for the Eyes</h2>
                    <p className="mt-2 mb-6 max-w-2xl mx-auto">Explore moments of culinary art and cozy ambiance from our restaurant.</p>
                    <div className="flex gap-4 justify-center">
                        <Button asChild variant="outline" size="lg" className="border-accent text-accent hover:bg-accent hover:text-black">
                            <Link href="/gallery">
                                View Full Gallery <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button asChild variant="secondary" size="lg">
                            <Link href="/#party-booking">
                                Book Party Center <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { testimonials } from '@/lib/data';

export function Testimonials() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="container mx-auto px-4 text-center">
        <p className="font-body text-primary uppercase tracking-[0.2em]">What Our Guests Say</p>
        <h2 className="font-headline text-4xl md:text-5xl font-bold mt-2 mb-12">
          Stories from Our Diners
        </h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full flex flex-col justify-between shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center text-center p-6 gap-4">
                        <div className="flex text-accent">
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                                <Star key={i} fill="currentColor" className="w-5 h-5" />
                            ))}
                        </div>
                      <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                      <p className="font-bold font-headline mt-2 text-lg">{testimonial.author}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}

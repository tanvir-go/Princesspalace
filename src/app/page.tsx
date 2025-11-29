

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Hero } from '@/components/sections/Hero';
import { Testimonials } from '@/components/sections/Testimonials';
import { GalleryPreview } from '@/components/sections/GalleryPreview';
import { Footer } from '@/components/layout/Footer';
import { ReservationForm } from '@/components/forms/ReservationForm';
import { ReviewForm } from '@/components/forms/ReviewForm';
import { Menu } from '@/components/sections/Menu';
import { PartyBookingForm } from '@/components/forms/PartyBookingForm';
import { LandingPageHeader } from '@/components/layout/LandingPageHeader';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingPageHeader />
      <main className="flex-1">
        <Hero />
        <Menu />
        <section id="reservation" className="w-full py-12 md:py-24 lg:py-32 bg-[#09090B]">
            <div className="container px-4 md:px-6">
                <ReservationForm />
            </div>
        </section>
        <Testimonials />
        <section id="party-booking" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <PartyBookingForm showPaymentDetails={false} />
            </div>
        </section>
        <GalleryPreview />
        <section id="review" className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
                <ReviewForm />
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

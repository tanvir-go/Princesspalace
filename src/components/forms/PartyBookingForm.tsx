

"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { CalendarIcon, MessageCircle, Phone } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";


export type PartyBooking = {
  id: string;
  name: string;
  phone: string;
  date: string;
  eventType: string;
  guestCount: number;
  requests?: string;
  total: number;
  advance: number;
  discount: number;
  due: number;
};

export function PartyBookingForm({ onSuccess, showPaymentDetails = true }: { onSuccess?: (booking: PartyBooking) => void, showPaymentDetails?: boolean }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState<Date>();
  const [eventType, setEventType] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [requests, setRequests] = useState('');
  
  const [total, setTotal] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [due, setDue] = useState(0);

  useEffect(() => {
    const calculatedDue = total - advance - discount;
    setDue(calculatedDue > 0 ? calculatedDue : 0);
  }, [total, advance, discount]);
  
  const restaurantPhoneNumber = "01646497530";
  const whatsappMessage = `Hello, I'd like to book the party center.
Name: ${name}
Phone: ${phone}
Date: ${date ? format(date, "PPP") : ''}
Event Type: ${eventType}
Guest Count: ${guestCount} people
Special Requests: ${requests || 'None'}`;
  const whatsappUrl = `https://wa.me/${restaurantPhoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleBookingClick = (e: React.MouseEvent) => {
    if (!name || !phone || !date || !eventType || !guestCount) {
        e.preventDefault();
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out all required fields before proceeding.",
        });
    }
  };


  return (
    <Card className="w-full max-w-3xl mx-auto shadow-2xl">
        <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl">Book The Party Center</CardTitle>
            <CardDescription>Plan your next event with us. Fill out the details below.</CardDescription>
        </CardHeader>
        <CardContent>
            <form ref={formRef} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                        <Input id="name" name="name" placeholder="Your Name" required value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                        <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" required value={phone} onChange={e => setPhone(e.target.value)}/>
                    </div>
                </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Event Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate()))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Event Type</label>
                        <Select name="eventType" required value={eventType} onValueChange={setEventType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="birthday">Birthday Party</SelectItem>
                                <SelectItem value="anniversary">Anniversary</SelectItem>
                                <SelectItem value="corporate">Corporate Event</SelectItem>
                                <SelectItem value="wedding">Wedding Reception</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                     <div className="space-y-2">
                        <label htmlFor="guestCount" className="text-sm font-medium">Number of Guests</label>
                        <Input id="guestCount" name="guestCount" type="number" placeholder="e.g., 50" required min="10" value={guestCount} onChange={e => setGuestCount(e.target.value)} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="requests" className="text-sm font-medium">Special Requests</label>
                    <Textarea id="requests" name="requests" placeholder="Let us know about any special requirements, menu preferences, or decorations." value={requests} onChange={e => setRequests(e.target.value)} />
                </div>
                
                {showPaymentDetails && (
                    <>
                        <Separator />
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Payment Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                <label htmlFor="total" className="text-sm font-medium">Total Amount (৳)</label>
                                <Input id="total" name="total" type="number" placeholder="e.g., 25000" value={total} onChange={(e) => setTotal(Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                <label htmlFor="advance" className="text-sm font-medium">Advance (৳)</label>
                                <Input id="advance" name="advance" type="number" placeholder="e.g., 5000" value={advance} onChange={(e) => setAdvance(Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                <label htmlFor="discount" className="text-sm font-medium">Discount (৳)</label>
                                <Input id="discount" name="discount" type="number" placeholder="e.g., 1000" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
                                </div>
                                <div className="space-y-2">
                                <label htmlFor="due" className="text-sm font-medium">Due Amount (৳)</label>
                                <Input id="due" name="due" type="number" value={due} readOnly className="bg-muted"/>
                                </div>
                            </div>
                        </div>
                    </>
                )}


                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button" onClick={handleBookingClick} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                            Submit Booking Request
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Your Booking</AlertDialogTitle>
                            <AlertDialogDescription>
                                To finalize your party center booking, please contact us via phone or WhatsApp to confirm details and payment.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                         <div className="my-4 p-4 bg-muted rounded-lg text-center">
                            <p className="text-sm text-muted-foreground">Call or message us at:</p>
                            <p className="text-2xl font-bold tracking-wider">{restaurantPhoneNumber}</p>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Link href={whatsappUrl} target="_blank" className="bg-green-500 hover:bg-green-600">
                                <MessageCircle className="mr-2 h-4 w-4" /> Book on WhatsApp
                                </Link>
                            </AlertDialogAction>
                            <AlertDialogAction asChild>
                                <a href={`tel:${restaurantPhoneNumber}`}>
                                <Phone className="mr-2 h-4 w-4" /> Call to Book
                                </a>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </form>
        </CardContent>
    </Card>
  );
}

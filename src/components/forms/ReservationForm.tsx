
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

export function ReservationForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState<Date>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState('2');

  const timeSlots = ["5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];
  const restaurantPhoneNumber = "+8801646497530";
  
  const whatsappMessage = `Hello, I'd like to book a table.
Name: ${name}
Date: ${date ? format(date, "PPP") : ''}
Time: ${time}
Party Size: ${partySize} people`;
  const whatsappUrl = `https://wa.me/${restaurantPhoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;


  const handleReservationClick = (e: React.MouseEvent) => {
    if (!name || !email || !phone || !date || !time) {
        e.preventDefault();
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please fill out all required fields before proceeding.",
        });
    }
  };


  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl bg-background/90 backdrop-blur-sm">
        <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl">Book Your Table</CardTitle>
            <CardDescription>We would be happy to host you.</CardDescription>
        </CardHeader>
        <CardContent>
            <form ref={formRef} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                        <Input id="name" name="name" placeholder="John Doe" required value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                        <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
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
                                    disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Time</label>
                        <Select name="time" required value={time} onValueChange={setTime}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                                {timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Party Size</label>
                        <Select name="partySize" value={partySize} onValueChange={setPartySize} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select party size" />
                            </SelectTrigger>
                            <SelectContent>
                                {[...Array(8)].map((_, i) => <SelectItem key={i+1} value={(i + 1).toString()}>{i+1} Person{i>0 && 's'}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                    <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" required value={phone} onChange={e => setPhone(e.target.value)}/>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button" onClick={handleReservationClick} className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                            Confirm Reservation
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Your Reservation</AlertDialogTitle>
                            <AlertDialogDescription>
                                To finalize your booking, please contact us via phone or WhatsApp.
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
                                <MessageCircle className="mr-2 h-4 w-4" /> Order on WhatsApp
                                </Link>
                            </AlertDialogAction>
                            <AlertDialogAction asChild>
                                <a href={`tel:${restaurantPhoneNumber}`}>
                                <Phone className="mr-2 h-4 w-4" /> Call to Order
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

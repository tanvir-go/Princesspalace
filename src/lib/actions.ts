

"use server";

import { moderateReview } from "@/ai/flows/moderate-customer-reviews";
import { z } from "zod";
import type { PartyBooking } from "@/components/forms/PartyBookingForm";
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import {getApp, getApps, initializeApp} from "firebase-admin/app";
import { firebaseConfig } from "@/firebase/config";

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  rating: z.coerce.number().min(1).max(5),
  reviewText: z.string().min(10, "Review must be at least 10 characters."),
});

const reservationSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Invalid phone number."),
  date: z.date(),
  time: z.string(),
  partySize: z.coerce.number().min(1, "Party size must be at least 1."),
});

const registrationSchema = z.object({
  displayName: z.string().min(2, "Name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const partyBookingSchema = z.object({
    name: z.string().min(2, "Name is required."),
    phone: z.string().min(10, "A valid phone number is required."),
    date: z.date({ required_error: "Please select a date for the event."}),
    eventType: z.string({ required_error: "Please select an event type."}),
    guestCount: z.coerce.number().min(10, "Party bookings require a minimum of 10 guests."),
    requests: z.string().optional(),
    total: z.coerce.number().min(0),
    advance: z.coerce.number().min(0),
    discount: z.coerce.number().min(0),
    due: z.coerce.number().min(0),
});


// Helper to initialize Firebase Admin SDK
function getFirebaseAdminApp() {
  if (getApps().length) {
    return getApp();
  }
  return initializeApp({ projectId: firebaseConfig.projectId });
}


export type ReviewFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  success: boolean;
};


export async function submitReview(
  prevState: ReviewFormState,
  data: FormData
): Promise<ReviewFormState> {
  const formData = Object.fromEntries(data);
  const parsed = reviewSchema.safeParse(formData);

  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.message);
    return {
      message: "Invalid form data",
      issues,
      success: false,
    };
  }

  const { reviewText } = parsed.data;

  try {
    const moderationResult = await moderateReview({ reviewText });

    if (!moderationResult.isAppropriate) {
      return {
        message: `Your review could not be posted. Reason: ${moderationResult.reason || "Content policy violation."}`,
        success: false,
      };
    }
    const db = getFirestore(getFirebaseAdminApp());
    await db.collection('customerReviews').add({
        ...parsed.data,
        isApproved: true, // Auto-approved after moderation
        datePosted: new Date().toISOString()
    });


    return { message: "Thank you for your review!", success: true };
  } catch (error) {
    console.error("Error submitting review:", error);
    return {
      message: "An unexpected error occurred. Please try again later.",
      success: false,
    };
  }
}

export type ReservationFormState = {
    message: string;
    success: boolean;
};

export async function submitReservation(
    prevState: ReservationFormState,
    data: FormData
): Promise<ReservationFormState> {
    const rawData = {
        name: data.get('name'),
        email: data.get('email'),
        phone: data.get('phone'),
        date: data.get('date') ? new Date(data.get('date') as string) : undefined,
        time: data.get('time'),
        partySize: data.get('partySize')
    };

    const parsed = reservationSchema.safeParse(rawData);
    
    if (!parsed.success) {
        return {
            message: `Invalid form data. ${parsed.error.issues.map(i => i.message).join(', ')}`,
            success: false,
        };
    }

    try {
        const db = getFirestore(getFirebaseAdminApp());
        await db.collection('reservations').add({
            customerName: parsed.data.name,
            email: parsed.data.email,
            phoneNumber: parsed.data.phone,
            reservationDate: parsed.data.date.toISOString(),
            reservationTime: parsed.data.time,
            partySize: parsed.data.partySize,
            createdAt: new Date().toISOString()
        });
    
        return {
            message: `Thank you, ${parsed.data.name}! Your reservation for ${parsed.data.partySize} on ${parsed.data.date.toLocaleDateString()} at ${parsed.data.time} is confirmed.`,
            success: true,
        };
    } catch(error) {
        console.error("Error submitting reservation", error);
         return {
            message: "We encountered an issue submitting your reservation. Please try again later.",
            success: false,
        };
    }
}


export type RegistrationFormState = {
  message: string;
  success: boolean;
};

export async function submitRegistration(
  prevState: RegistrationFormState,
  data: FormData
): Promise<RegistrationFormState> {
    const formData = Object.fromEntries(data);
    const parsed = registrationSchema.safeParse(formData);

    if (!parsed.success) {
        return {
            message: parsed.error.issues.map((issue) => issue.message).join(", "),
            success: false,
        };
    }
    
    const { displayName, email, password } = parsed.data;

    try {
        const app = getFirebaseAdminApp();
        const auth = getAuth(app);
        const db = getFirestore(app);

        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName,
        });
        
        // Create user profile in Firestore
        const userDocRef = db.collection('users').doc(userRecord.uid);
        await userDocRef.set({
            displayName,
            email,
            role: 'customer', // Default role for new sign-ups
        });

        return {
            message: "Account created successfully! You can now log in.",
            success: true,
        };
    } catch (error: any) {
        let message = "An unexpected error occurred.";
        if (error.code === 'auth/email-already-exists') {
            message = 'This email is already in use. Please try another email or log in.';
        }
        console.error("Registration error:", error);
        return {
            message,
            success: false,
        };
    }
}

export type PartyBookingFormState = {
    message: string;
    success: boolean;
    booking: PartyBooking | null;
};

export async function submitPartyBooking(
    prevState: PartyBookingFormState,
    data: FormData
): Promise<PartyBookingFormState> {
    const rawData = {
        name: data.get('name'),
        phone: data.get('phone'),
        date: data.get('date') ? new Date(data.get('date') as string) : undefined,
        eventType: data.get('eventType'),
        guestCount: data.get('guestCount'),
        requests: data.get('requests'),
        total: data.get('total'),
        advance: data.get('advance'),
        discount: data.get('discount'),
        due: data.get('due'),
    };

    const parsed = partyBookingSchema.safeParse(rawData);
    
    if (!parsed.success) {
        return {
            message: `Invalid form data: ${parsed.error.issues.map(i => i.message).join(', ')}`,
            success: false,
            booking: null,
        };
    }

    const newBookingData = {
      ...parsed.data,
      date: parsed.data.date.toISOString(),
      createdAt: new Date().toISOString()
    };
    
    // In a real app, you would save this to a database and notify the restaurant staff.
    console.log("Party Booking Request submitted:", newBookingData);
    
    const newBooking: PartyBooking = {
      id: `bk-${Date.now()}`,
      ...parsed.data,
      date: parsed.data.date.toISOString(),
    };
    
    return {
        message: `Thank you, ${parsed.data.name}! Your request to book the party center for ${parsed.data.guestCount} guests on ${parsed.data.date.toLocaleDateString()} has been received. We will contact you shortly to confirm the details.`,
        success: true,
        booking: newBooking,
    };
}

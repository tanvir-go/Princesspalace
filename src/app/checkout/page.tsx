
'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, UserCheck } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { addDoc, collection, serverTimestamp, getFirestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useFirebaseApp } from '@/firebase';


function CheckoutPageContent() {
    const { cart, clearCart } = useCart();
    const router = useRouter();
    const { toast } = useToast();
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [bkashTrxId, setBkashTrxId] = useState('');
    const { user, loading } = useAuth();
    const app = useFirebaseApp();
    const db = getFirestore(app);

    if (loading) {
        return (
             <div className="container mx-auto py-12 px-4 md:px-6">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <Skeleton className="h-6 w-1/4" />
                            <div className="space-y-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </div>
                         <div className="space-y-6">
                            <Skeleton className="h-6 w-1/4" />
                             <div className="space-y-4">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-12 w-full" />
                    </CardFooter>
                </Card>
            </div>
        )
    }
    
    if (!user) {
         return (
            <div className="container mx-auto py-12 px-4 md:px-6">
                <Card className="max-w-2xl mx-auto text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">Please Login to Continue</CardTitle>
                        <CardDescription>You need to be logged in to place an order.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                        <UserCheck className="w-24 h-24 text-muted-foreground mb-6" />
                        <p className="mb-6">Please log in to your account or create a new one to complete your purchase.</p>
                        <div className="flex gap-4">
                            <Button asChild>
                                <Link href="/login?redirect=/checkout">Login</Link>
                            </Button>
                             <Button asChild variant="secondary">
                                <Link href="/register?redirect=/checkout">Create Account</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h1 className="text-3xl font-headline mb-4">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Button asChild>
                    <Link href="/">Back to Menu</Link>
                </Button>
            </div>
        )
    }

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (!db || !user) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not connect to the database. Please try again.',
            });
            return;
        }

        if (paymentMethod === 'bkash' && !bkashTrxId) {
            toast({
                variant: 'destructive',
                title: 'Transaction ID Required',
                description: 'Please enter your bKash transaction ID to proceed.',
            });
            return;
        }

        const orderData = {
            userId: user.uid,
            userName: user.displayName,
            tableNumber: 0, // 0 indicates a takeaway/delivery order
            status: 'Kitchen Pending',
            items: cart.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
            total: subtotal,
            createdAt: serverTimestamp(),
            paymentMethod,
            bkashTrxId: paymentMethod === 'bkash' ? bkashTrxId : '',
        };
        
        const ordersCollection = collection(db, 'orders');

        addDoc(ordersCollection, orderData)
        .then((docRef) => {
            console.log("Order placed with ID:", docRef.id);
            toast({
                title: 'Order Placed Successfully!',
                description: 'Thank you for your order. You can track its status on your dashboard.',
            });
            clearCart();
            router.push('/dashboard');
        })
        .catch(err => {
             errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                  path: 'orders',
                  operation: 'create',
                  requestResourceData: orderData,
                })
              );
        });
    };

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Checkout</CardTitle>
                    <CardDescription>Please review your order and complete the payment.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Order Summary */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold">Order Summary</h3>
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.name} className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">{formatPrice(item.price)} x {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <p>Subtotal</p>
                                <p>{formatPrice(subtotal)}</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-6">
                             <h3 className="text-xl font-semibold">Payment Method</h3>
                             <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                <Label htmlFor="cod" className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-muted has-[[data-state=checked]]:bg-muted has-[[data-state=checked]]:border-primary">
                                    <RadioGroupItem value="cod" id="cod" />
                                    <div className="grid gap-1.5">
                                        <p className="font-medium">Cash on Delivery</p>
                                        <p className="text-sm text-muted-foreground">Pay with cash when your order is delivered.</p>
                                    </div>
                                </Label>
                                <Label htmlFor="bkash" className="flex items-center space-x-3 border rounded-md p-4 cursor-pointer hover:bg-muted has-[[data-state=checked]]:bg-muted has-[[data-state=checked]]:border-primary">
                                    <RadioGroupItem value="bkash" id="bkash" />
                                    <div className="grid gap-1.5">
                                         <p className="font-medium flex items-center gap-2">
                                            Pay with bKash
                                            <Image src="/bkash.png" alt="bKash" width={50} height={20} />
                                        </p>
                                        <p className="text-sm text-muted-foreground">Pay securely via bKash Send Money.</p>
                                    </div>
                                </Label>
                             </RadioGroup>

                            {paymentMethod === 'bkash' && (
                                <Alert>
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>bKash Payment Instructions</AlertTitle>
                                    <AlertDescription className="space-y-2">
                                        <p>Please <strong>Send Money</strong> of <strong>{formatPrice(subtotal)}</strong> to the following bKash personal number:</p>
                                        <p className="font-bold text-lg text-center bg-muted p-2 rounded-md">01787010821</p>
                                        <p>After sending the money, enter the <strong>Transaction ID (TrxID)</strong> below.</p>
                                        <div className="space-y-2 pt-2">
                                            <Label htmlFor="bkash-trxid" className="font-semibold">bKash Transaction ID</Label>
                                            <Input 
                                                id="bkash-trxid"
                                                value={bkashTrxId}
                                                onChange={e => setBkashTrxId(e.target.value)}
                                                placeholder="e.g., 9X3Y8Z7A2B"
                                            />
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" size="lg" onClick={handlePlaceOrder}>
                        Place Order ({formatPrice(subtotal)})
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}

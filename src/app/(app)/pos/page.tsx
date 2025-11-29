
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menuData, type MenuItem } from "@/lib/menu-data";
import { formatPrice } from "@/lib/utils";
import { PlusCircle, Printer, Star, Trash2 } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface OrderItem extends MenuItem {
    quantity: number;
}

const getPrice = (item: MenuItem): number => {
    if (typeof item.price === 'number') {
        return item.price;
    }
    if (Object.values(item.price).length > 0) {
        // Return the first available price for simplicity in POS
        return Object.values(item.price)[0];
    }
    return 0;
};

export default function POSPage() {
    const { user } = useAuth();
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [customerNumber, setCustomerNumber] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleAddItem = (item: MenuItem) => {
        setOrderItems((prevItems) => {
            const existingItem = prevItems.find((i) => i.name === item.name);
            if (existingItem) {
                return prevItems.map((i) =>
                    i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
    };
    
    const handleRemoveItem = (itemName: string) => {
        setOrderItems(orderItems.filter(item => item.name !== itemName));
    };

    const handleQuantityChange = (itemName: string, quantity: number) => {
        if (quantity < 1) {
            handleRemoveItem(itemName);
            return;
        }
        setOrderItems(orderItems.map(item => item.name === itemName ? { ...item, quantity } : item));
    };

    const calculateSubtotal = () => {
        return orderItems.reduce((total, item) => total + getPrice(item) * item.quantity, 0);
    };
    
    const total = calculateSubtotal();
    
     const handlePrintBill = () => {
        const now = new Date();
        const printContent = `
            <div style="font-family: monospace; width: 300px; padding: 10px; margin: auto;">
                <h2 style="text-align: center; margin: 0; font-size: 1.5rem;">Princesspalace</h2>
                <p style="text-align: center; font-size: 0.8rem; border-bottom: 1px dashed black; padding-bottom: 10px;">Takeaway Bill</p>
                <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                    <span><strong>Bill No:</strong> ${Date.now().toString().slice(-6)}</span>
                    <span><strong>Date:</strong> ${now.toLocaleDateString()}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                     <span><strong>Time:</strong> ${now.toLocaleTimeString()}</span>
                     <span><strong>Cashier:</strong> ${user?.displayName || 'N/A'}</span>
                </div>
                <div style="margin-top: 5px;">
                    <p><strong>Customer:</strong> ${customerName || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${customerNumber || 'N/A'}</p>
                </div>
                <hr style="border-top: 1px dashed black; margin: 10px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="text-align: left; padding: 2px;">Item</th>
                            <th style="text-align: center; padding: 2px;">Qty</th>
                            <th style="text-align: right; padding: 2px;">Price</th>
                            <th style="text-align: right; padding: 2px;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderItems.map(item => `
                            <tr>
                                <td style="padding: 2px;">${item.name}</td>
                                <td style="text-align: center; padding: 2px;">${item.quantity}</td>
                                <td style="text-align: right; padding: 2px;">${formatPrice(getPrice(item))}</td>
                                <td style="text-align: right; padding: 2px;">${formatPrice(getPrice(item) * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <hr style="border-top: 1px dashed black; margin: 10px 0;">
                <table style="width: 100%;">
                    <tbody>
                        <tr><td>Subtotal:</td><td style="text-align:right;">${formatPrice(calculateSubtotal())}</td></tr>
                    </tbody>
                </table>
                <hr style="border-top: 1px solid black; margin: 10px 0;">
                <h3 style="text-align: right; font-size: 1.2rem;">Total: ${formatPrice(total)}</h3>
                <hr style="border-top: 1px dashed black; margin: 10px 0;">
                <p style="text-align: center; font-size: 0.8rem; margin-top: 10px;">Thank you for your visit!</p>
            </div>
        `;
        
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Customer Bill</title></head><body>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
            printWindow.close();

            // Reset state
            setOrderItems([]);
            setCustomerName('');
            setCustomerNumber('');
            setReview('');
            setRating(0);
        }
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Menu */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Point of Sale (POS)</CardTitle>
                        <CardDescription>Select items to create a new takeaway order.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue={menuData[0].title} className="w-full">
                            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-auto">
                                {menuData.map((category) => (
                                    <TabsTrigger key={category.title} value={category.title}>{category.title}</TabsTrigger>
                                ))}
                            </TabsList>
                            {menuData.map((category) => (
                                <TabsContent key={category.title} value={category.title} className="mt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {category.items.map((item) => (
                                            <Card key={item.name} className="flex flex-col">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">{item.name}</CardTitle>
                                                    <CardDescription className="text-primary font-bold">{formatPrice(getPrice(item))}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="flex-grow">
                                                    <p className="text-xs text-muted-foreground">{item.description}</p>
                                                </CardContent>
                                                <CardFooter>
                                                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleAddItem(item)}>
                                                        <PlusCircle className="mr-2 h-4 w-4" /> Add to Order
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Order Details */}
            <div className="lg:col-span-1 sticky top-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Current Order</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Customer Info */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Customer Details</h3>
                            <div className="space-y-2">
                                <Label htmlFor="customer-name">Customer Name</Label>
                                <Input id="customer-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g., Walk-in Customer" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customer-number">Phone Number</Label>
                                <Input id="customer-number" value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} placeholder="Optional" />
                            </div>
                        </div>

                        <Separator />

                        {/* Order Items */}
                        <div className="space-y-4">
                             <h3 className="text-sm font-medium text-muted-foreground">Order Items</h3>
                            {orderItems.length === 0 ? (
                                <p className="text-sm text-center text-muted-foreground py-4">No items added yet.</p>
                            ) : (
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                    {orderItems.map((item) => (
                                        <div key={item.name} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">{formatPrice(getPrice(item))}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input 
                                                    type="number" 
                                                    className="w-16 h-8" 
                                                    value={item.quantity} 
                                                    onChange={(e) => handleQuantityChange(item.name, parseInt(e.target.value, 10))}
                                                    min="1"
                                                />
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleRemoveItem(item.name)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Separator />
                        
                        {/* Totals */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{formatPrice(calculateSubtotal())}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                        
                         <Separator />

                        {/* Review & Rating */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Customer Feedback (Optional)</h3>
                             <div className="space-y-2">
                                <Label>Rating</Label>
                                <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                    type="button"
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-0 bg-transparent border-none"
                                    >
                                    <Star
                                        className={cn(
                                        "w-6 h-6 cursor-pointer transition-colors",
                                        (hoverRating || rating) >= star ? "text-accent fill-accent" : "text-gray-400"
                                        )}
                                    />
                                    </button>
                                ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="review-text">Review</Label>
                                <Textarea id="review-text" value={review} onChange={(e) => setReview(e.target.value)} placeholder="Customer feedback..." />
                            </div>
                        </div>


                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" size="lg" onClick={handlePrintBill} disabled={orderItems.length === 0}>
                            <Printer className="mr-2 h-4 w-4" /> Submit & Print Bill
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

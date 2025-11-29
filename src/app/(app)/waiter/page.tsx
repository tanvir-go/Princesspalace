

'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { useCollection } from "@/firebase";
import type { Order } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { menuData } from "@/lib/menu-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Printer, Trash2 } from "lucide-react";
import { useState } from "react";
import { format, formatPrice, printPartyBookingInvoice } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { PartyBookingForm, PartyBooking } from "@/components/forms/PartyBookingForm";
import { Purchase, PurchaseEntryForm } from "@/components/forms/PurchaseEntryForm";

type LeaveRequest = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

const mockLeaveRequests: LeaveRequest[] = [
  { id: '1', startDate: '2024-07-20', endDate: '2024-07-21', reason: 'Family event', status: 'Approved' },
  { id: '2', startDate: '2024-08-01', endDate: '2024-08-05', reason: 'Vacation', status: 'Pending' },
  { id: '3', startDate: '2024-06-15', endDate: '2024-06-15', reason: 'Sick leave', status: 'Rejected' },
];

type SalaryAdvance = {
  id: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

const mockAdvanceRequests: SalaryAdvance[] = [
  { id: '1', amount: 5000, reason: 'Urgent family need', status: 'Approved' },
  { id: '2', amount: 2000, reason: 'Medical emergency', status: 'Pending' },
  { id: '3', amount: 3000, reason: 'Personal reasons', status: 'Rejected' },
];

const getStatusVariant = (status: string) => {
    switch (status) {
        case "Approved": return "default";
        case "Pending": return "secondary";
        case "Rejected": return "destructive";
        default: return "outline";
    }
};

function LeaveRequestList() {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Leave Request History</CardTitle>
                <CardDescription>A list of your past leave requests.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockLeaveRequests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>{request.startDate}</TableCell>
                                <TableCell>{request.endDate}</TableCell>
                                <TableCell>{request.reason}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function LeaveRequestForm() {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Leave Request</CardTitle>
                    <CardDescription>Submit a request for time off.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="leave-start-date">Start Date</Label>
                                <Input id="leave-start-date" type="date" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="leave-end-date">End Date</Label>
                                <Input id="leave-end-date" type="date" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leave-reason">Reason</Label>
                            <Textarea id="leave-reason" placeholder="Please provide a reason for your leave..." />
                        </div>
                        <Button type="submit">Submit Request</Button>
                    </form>
                </CardContent>
            </Card>
            <LeaveRequestList />
        </>
    )
}

function AdvanceRequestList() {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Salary Advance History</CardTitle>
                <CardDescription>A list of your past salary advance requests.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Amount (৳)</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockAdvanceRequests.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell>{request.amount.toFixed(2)}</TableCell>
                                <TableCell>{request.reason}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function AdvanceRequestForm() {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Salary Advance</CardTitle>
                    <CardDescription>Request an advance on your salary.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="advance-amount">Amount (৳)</Label>
                            <Input id="advance-amount" type="number" placeholder="e.g., 5000" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="advance-reason">Reason</Label>
                            <Textarea id="advance-reason" placeholder="Please provide a reason for your request..." />
                        </div>
                        <Button type="submit">Submit Request</Button>
                    </form>
                </CardContent>
            </Card>
            <AdvanceRequestList />
        </>
    )
}

const allMenuItems = menuData.flatMap(category => category.items);

function CreateOrderForm() {
    const { user } = useAuth();
    const [tableNumber, setTableNumber] = useState('');
    const [items, setItems] = useState<{ menuItemId: string, quantity: number, price: number }[]>([]);
    
    const findItemPrice = (name: string) => {
        const item = allMenuItems.find(i => i.name === name);
        if (!item) return 0;
        if (typeof item.price === 'number') return item.price;
        // Return the first price if it's an object with sizes
        return Object.values(item.price)[0] || 0;
    };
    
    const handleAddItem = () => {
        setItems([...items, { menuItemId: '', quantity: 1, price: 0 }]);
    };
    
    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        if (field === 'menuItemId') {
            newItems[index].menuItemId = value;
            newItems[index].price = findItemPrice(value);
        } else if (field === 'quantity') {
            newItems[index].quantity = parseInt(value, 10);
        }
        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handlePrintKOT = () => {
        const now = new Date();
        const printContent = `
            <div style="font-family: monospace; width: 300px; padding: 10px;">
                <h2 style="text-align: center; margin: 0;">Princesspalace</h2>
                <hr style="border-top: 1px dashed black; margin: 10px 0;">
                <p><strong>KOT No:</strong> ${Date.now()}</p>
                <p><strong>Date:</strong> ${now.toLocaleDateString()} <strong>Time:</strong> ${now.toLocaleTimeString()}</p>
                <p><strong>Waiter:</strong> ${user?.displayName || 'N/A'}</p>
                <p><strong>Table:</strong> ${tableNumber || 'N/A'}</p>
                <hr style="border-top: 1px dashed black; margin: 10px 0;">
                <table>
                    <thead>
                        <tr>
                            <th style="text-align: left;">Item</th>
                            <th style="text-align: right;">Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td>${item.menuItemId}</td>
                                <td style="text-align: right;">${item.quantity}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <hr style="border-top: 1px dashed black; margin: 10px 0;">
            </div>
        `;
        
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Kitchen Order Ticket</title></head><body>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
            printWindow.close();
        }
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Create New Order</CardTitle>
                <CardDescription>Create a new order for a table.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="table-number">Table Number</Label>
                        <Input 
                            id="table-number" 
                            type="number" 
                            placeholder="e.g., 5" 
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Menu Items</Label>
                        {items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-6">
                                    <Select onValueChange={(value) => handleItemChange(index, 'menuItemId', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allMenuItems.map(menuItem => (
                                                <SelectItem key={menuItem.name} value={menuItem.name}>{menuItem.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2">
                                     <Input 
                                        type="number" 
                                        value={item.quantity} 
                                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        min="1"
                                    />
                                </div>
                                <div className="col-span-3 text-right">
                                    <span>{formatPrice(item.price * item.quantity)}</span>
                                </div>
                                <div className="col-span-1">
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </div>
                </form>
            </CardContent>
             <CardFooter className="flex justify-between items-center">
                <div className="text-lg font-bold">
                    Total: {formatPrice(calculateTotal())}
                </div>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" onClick={handlePrintKOT}>Print Kitchen Copy</Button>
                    <Button type="submit">Create Order</Button>
                </div>
            </CardFooter>
        </Card>
    );
}

function OrderTabContent() {
    const { data: orders, loading } = useCollection<Order>('orders');
    const sortedOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

     if (loading) {
        return (
             <div className="space-y-4 mt-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
             </div>
        )
    }

    return (
        <div className="mt-4">
             <Accordion type="single" collapsible className="w-full mb-6">
                <AccordionItem value="create-order">
                    <AccordionTrigger>
                        <h3 className="text-lg font-medium">Create a New Order</h3>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <CreateOrderForm />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <OrdersTable 
                orders={sortedOrders}
                title="Current Orders"
                description="Manage all active and recent orders."
            />
        </div>
    )
}

function BookingList({ bookings }: { bookings: PartyBooking[] }) {
    if (bookings.length === 0) {
        return (
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Booking List</CardTitle>
                    <CardDescription>No party bookings have been made yet.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">The booking list is currently empty.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Booking List</CardTitle>
                <CardDescription>A list of all party center bookings.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Event Date</TableHead>
                            <TableHead>Guests</TableHead>
                            <TableHead>Event Type</TableHead>
                            <TableHead className="text-right">Total (৳)</TableHead>
                            <TableHead className="text-right">Due (৳)</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>{booking.name}</TableCell>
                                <TableCell>{format(new Date(booking.date), 'PPP')}</TableCell>
                                <TableCell>{booking.guestCount}</TableCell>
                                <TableCell>{booking.eventType}</TableCell>
                                <TableCell className="text-right">{booking.total.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-semibold">{booking.due.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                     <Button variant="outline" size="sm" onClick={() => printPartyBookingInvoice(booking)}>
                                        <Printer className="mr-2 h-4 w-4" />
                                        Print
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function PartyBookingTab({ onBookingSuccess, bookings }: { onBookingSuccess: (booking: PartyBooking) => void, bookings: PartyBooking[] }) {
    return (
        <div className="space-y-6">
            <PartyBookingForm onSuccess={onBookingSuccess} />
            <BookingList bookings={bookings} />
        </div>
    )
}

function PurchaseHistory({ purchases }: { purchases: Purchase[] }) {
    if (purchases.length === 0) {
        return <p className="text-sm text-muted-foreground mt-4 text-center">No purchase entries yet.</p>;
    }
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Purchase History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {purchases.map(p => (
                            <TableRow key={p.id}>
                                <TableCell>{format(new Date(p.purchaseDate), 'PPP')}</TableCell>
                                <TableCell>{p.item}</TableCell>
                                <TableCell>৳{p.total.toFixed(2)}</TableCell>
                                <TableCell><Badge variant={getStatusVariant(p.status)}>{p.status}</Badge></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

function PurchaseTab({ onAddPurchase, purchases }: { onAddPurchase: (purchase: Purchase) => void, purchases: Purchase[] }) {
    return (
        <div className="space-y-6">
            <PurchaseEntryForm onSubmit={onAddPurchase} />
            <PurchaseHistory purchases={purchases} />
        </div>
    )
}


export default function WaiterPage() {
    const [bookings, setBookings] = useState<PartyBooking[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);

    const handleBookingSuccess = (newBooking: PartyBooking) => {
        setBookings(prev => {
            if (prev.some(b => b.id === newBooking.id)) {
                return prev.map(b => b.id === newBooking.id ? newBooking : b);
            };
            return [...prev, newBooking]
        });
    };
    
    const handleAddPurchase = (newPurchase: Purchase) => {
        setPurchases(prev => [...prev, newPurchase]);
        // In a real app, this would also add to a list for admin approval
        alert("Purchase submitted for approval!");
    };


    return (
    <Tabs defaultValue="orders" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="party-booking">Party Booking</TabsTrigger>
        <TabsTrigger value="leave">Leave Request</TabsTrigger>
        <TabsTrigger value="advance">Advance Request</TabsTrigger>
        <TabsTrigger value="purchases">Purchases</TabsTrigger>
      </TabsList>
      <TabsContent value="orders">
        <OrderTabContent />
      </TabsContent>
       <TabsContent value="party-booking" className="mt-6">
        <PartyBookingTab onBookingSuccess={handleBookingSuccess} bookings={bookings} />
      </TabsContent>
      <TabsContent value="leave" className="mt-6">
        <LeaveRequestForm />
      </TabsContent>
      <TabsContent value="advance" className="mt-6">
        <AdvanceRequestForm />
      </TabsContent>
      <TabsContent value="purchases" className="mt-6">
        <PurchaseTab onAddPurchase={handleAddPurchase} purchases={purchases} />
      </TabsContent>
    </Tabs>
  );
}

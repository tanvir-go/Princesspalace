

'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useState, FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useCollection } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import type { Order } from "@/lib/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Printer } from "lucide-react";
import { PartyBookingForm, PartyBooking } from "@/components/forms/PartyBookingForm";
import { printPartyBookingInvoice } from "@/lib/utils";
import { Purchase, PurchaseEntryForm } from "@/components/forms/PurchaseEntryForm";

// --- Mock Data ---
const initialMockExpenses = [
    { id: '1', date: '2024-07-22', category: 'Groceries', amount: 15000, description: 'Weekly vegetable supply' },
    { id: '2', date: '2024-07-21', category: 'Utilities', amount: 5000, description: 'Electricity bill' },
    { id: '3', date: '2024-07-20', category: 'Maintenance', amount: 2500, description: 'Plumbing repair' },
];

const initialMockEmployees = [
    { id: 'emp1', name: 'John Doe', role: 'Waiter', salary: 25000, status: 'Active' },
    { id: 'emp2', name: 'Jane Smith', role: 'Chef', salary: 45000, status: 'Active' },
    { id: 'emp3', name: 'Sam Wilson', role: 'Cleaner', salary: 18000, status: 'On Leave' },
];

const mockPayroll = [
    { id: 'pay1', employeeId: 'emp1', employeeName: 'John Doe', payDate: '2024-06-30', amount: 25000, status: 'Paid' },
    { id: 'pay2', employeeId: 'emp2', employeeName: 'Jane Smith', payDate: '2024-06-30', amount: 45000, status: 'Paid' },
    { id: 'pay3', employeeId: 'emp3', employeeName: 'Sam Wilson', payDate: '2024-06-30', amount: 18000, status: 'Paid' },
];

const mockLeaveRequests = [
  { id: '1', employee: 'John Doe', startDate: '2024-08-01', endDate: '2024-08-05', reason: 'Vacation', status: 'Pending' },
  { id: '2', employee: 'Sam Wilson', startDate: '2024-07-25', endDate: '2024-07-25', reason: 'Sick leave', status: 'Approved' },
];

const getStatusVariant = (status: string) => {
    switch (status) {
        case "Active":
        case "Approved":
        case "Paid":
             return "default";
        case "On Leave":
        case "Pending":
        case "Payment Pending":
             return "secondary";
        case "Inactive":
        case "Rejected":
        case "Payment Rejected":
            return "destructive";
        default: return "outline";
    }
};

type LeaveRequest = {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

const mockFinanceLeaveRequests: LeaveRequest[] = [
  { id: '1', startDate: '2024-07-20', endDate: '2024-07-21', reason: 'Family event', status: 'Approved' },
];

type SalaryAdvance = {
  id: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Paid' | 'Payment Pending' | 'Payment Rejected';
};

const mockFinanceAdvanceRequests: SalaryAdvance[] = [
  { id: '1', amount: 3000, reason: 'Personal reasons', status: 'Approved' },
];


// --- Components ---

function ApprovalsTab({ advanceRequests, onAdvanceStatusChange }: { advanceRequests: any[], onAdvanceStatusChange: (id: string, status: string) => void }) {
     return(
        <div className="grid gap-6 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Leave Requests</CardTitle>
                    <CardDescription>View employee leave requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockLeaveRequests.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell>{req.employee}</TableCell>
                                    <TableCell>{req.startDate} to {req.endDate}</TableCell>
                                    <TableCell>{req.reason}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(req.status)}>{req.status}</Badge></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Salary Advance Requests</CardTitle>
                    <CardDescription>Confirm or reject salary advance payments.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {advanceRequests.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell>{req.employee}</TableCell>
                                    <TableCell>৳{req.amount.toFixed(2)}</TableCell>
                                    <TableCell>{req.reason}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(req.status)}>{req.status}</Badge></TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                            <Button disabled={req.status !== 'Payment Pending'} aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => onAdvanceStatusChange(req.id, 'Paid')}>Confirm Payment</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-500" onClick={() => onAdvanceStatusChange(req.id, 'Payment Rejected')}>Reject Payment</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

function ExpenseForm({ employees, onAddExpense }: { employees: any[], onAddExpense: (expense: any) => void }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newExpense = {
            id: `exp${Date.now()}`,
            date: formData.get('date') as string,
            category: formData.get('category') as string,
            amount: Number(formData.get('amount')),
            description: formData.get('description') as string,
            employeeId: formData.get('employeeId') as string | undefined,
        };
        onAddExpense(newExpense);
        e.currentTarget.reset();
        setSelectedCategory('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
                <CardDescription>Record a new business expense.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expense-date">Date</Label>
                            <Input name="date" id="expense-date" type="date" defaultValue={format(new Date(), 'yyyy-MM-dd')} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expense-category">Category</Label>
                            <Select name="category" onValueChange={setSelectedCategory} required>
                                <SelectTrigger id="expense-category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="groceries">Groceries</SelectItem>
                                    <SelectItem value="utilities">Utilities</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                    <SelectItem value="marketing">Marketing</SelectItem>
                                    <SelectItem value="salary-advance">Salary Advance</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {selectedCategory === 'salary-advance' && (
                        <div className="space-y-2">
                            <Label htmlFor="employee-select">Employee</Label>
                            <Select name="employeeId" required>
                                <SelectTrigger id="employee-select">
                                    <SelectValue placeholder="Select an employee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map(emp => (
                                        <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="expense-amount">Amount (৳)</Label>
                        <Input name="amount" id="expense-amount" type="number" placeholder="e.g., 5000" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="expense-description">Description</Label>
                        <Textarea name="description" id="expense-description" placeholder="A brief description of the expense..." />
                    </div>
                    <Button type="submit">Add Expense</Button>
                </form>
            </CardContent>
        </Card>
    );
}

function ExpenseList({ expenses }: { expenses: any[] }) {
    return (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Expense History</CardTitle>
                <CardDescription>A list of all recorded expenses.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount (৳)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell>{expense.date}</TableCell>
                                <TableCell><Badge variant="outline">{expense.category}</Badge></TableCell>
                                <TableCell>{expense.description}</TableCell>
                                <TableCell className="text-right">{expense.amount.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function PayrollTab({ employees, expenses }: { employees: any[], expenses: any[] }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Process Payroll</CardTitle>
                        <CardDescription>Run payroll for the current period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Salary</TableHead>
                                    <TableHead>Advance</TableHead>
                                    <TableHead>Net Payable</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.map(emp => {
                                    const advanceAmount = expenses
                                        .filter(exp => exp.category === 'salary-advance' && exp.employeeId === emp.id)
                                        .reduce((sum, exp) => sum + exp.amount, 0);

                                    const netPayable = emp.salary - advanceAmount;
                                    
                                    return (
                                        <TableRow key={emp.id}>
                                            <TableCell>{emp.name}</TableCell>
                                            <TableCell>{emp.role}</TableCell>
                                            <TableCell>৳{emp.salary.toFixed(2)}</TableCell>
                                            <TableCell className={advanceAmount > 0 ? 'text-destructive' : ''}>
                                                ৳{advanceAmount.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="font-semibold">৳{netPayable.toFixed(2)}</TableCell>
                                            <TableCell><Badge variant={emp.status === 'Active' ? 'default' : 'secondary'}>{emp.status}</Badge></TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter>
                        <Button>Process Payroll for July 2024</Button>
                    </CardFooter>
                </Card>
            </div>
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Payroll History</CardTitle>
                        <CardDescription>June 2024</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockPayroll.map(p => (
                                     <TableRow key={p.id}>
                                        <TableCell>{p.employeeName}</TableCell>
                                        <TableCell className="text-right">৳{p.amount.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ReportsTab({expenses} : {expenses: any[]}) {
     const { data: orders, loading: ordersLoading } = useCollection<Order>('orders');
     const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
     const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
     const netProfit = totalRevenue - totalExpenses;

    if (ordersLoading) return <Skeleton className="h-96 w-full" />

    return (
        <div className="grid gap-6">
            <div className="grid md:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">৳{totalRevenue.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">From {orders.length} orders</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">৳{totalExpenses.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">From {expenses.length} entries</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Net Profit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-3xl font-bold ${netProfit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ৳{netProfit.toFixed(2)}
                        </p>
                         <p className="text-xs text-muted-foreground">Revenue - Expenses</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Sales Report</CardTitle>
                    <CardDescription>A summary of recent sales activity.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Placeholder for a chart */}
                    <Skeleton className="w-full h-64" />
                </CardContent>
            </Card>
        </div>
    )
}

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
                        {mockFinanceLeaveRequests.map((request) => (
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
                        {mockFinanceAdvanceRequests.map((request) => (
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

export default function FinancePage() {
  const [employees, setEmployees] = useState(initialMockEmployees);
  const [expenses, setExpenses] = useState(initialMockExpenses);
  const [advanceRequests, setAdvanceRequests] = useState([
    { id: '1', employee: 'John Doe', amount: 5000, reason: 'Urgent family need', status: 'Payment Pending', employeeId: 'emp1' },
    { id: '2', employee: 'Jane Smith', amount: 10000, reason: 'Medical emergency', status: 'Paid', employeeId: 'emp2' }
  ]);
  const [bookings, setBookings] = useState<PartyBooking[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  const handleAddExpense = (newExpense: any) => {
    if (newExpense.category === 'salary-advance') {
        const employee = employees.find(e => e.id === newExpense.employeeId);
        const newAdvance = {
            id: newExpense.id,
            employee: employee ? employee.name : 'Unknown',
            employeeId: newExpense.employeeId,
            amount: newExpense.amount,
            reason: newExpense.description,
            status: 'Payment Pending' 
        };
        setAdvanceRequests(prev => [...prev, newAdvance]);
    }
    setExpenses(prev => [...prev, newExpense]);
  };
  
  const handleAdvanceStatusChange = (id: string, status: string) => {
    setAdvanceRequests(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };
  
  const handleBookingSuccess = (newBooking: PartyBooking) => {
    setBookings(prev => {
        if (prev.some(b => b.id === newBooking.id)) {
            return prev.map(b => b.id === newBooking.id ? newBooking : b);
        }
        return [...prev, newBooking]
    });
  };

  const handleAddPurchase = (newPurchase: Purchase) => {
    setPurchases(prev => [...prev, newPurchase]);
    // In a real app, this would also add to a list for admin approval
    alert("Purchase submitted for approval!");
  };

  return (
    <Tabs defaultValue="expenses" className="w-full">
        <Card>
            <CardHeader>
                <CardTitle>Finance & Accounts</CardTitle>
                <CardDescription>Manage expenses, payroll, and view financial reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <TabsList className="grid w-full grid-cols-8">
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="approvals">Approvals</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="payroll">Payroll</TabsTrigger>
                    <TabsTrigger value="party-booking">Party Booking</TabsTrigger>
                    <TabsTrigger value="leave">Leave Request</TabsTrigger>
                    <TabsTrigger value="advance">Advance Request</TabsTrigger>
                    <TabsTrigger value="purchases">Purchases</TabsTrigger>
                </TabsList>
            </CardContent>
        </Card>
      <TabsContent value="expenses" className="mt-6">
        <ExpenseForm employees={employees} onAddExpense={handleAddExpense} />
        <ExpenseList expenses={expenses} />
      </TabsContent>
       <TabsContent value="approvals" className="mt-6">
            <ApprovalsTab advanceRequests={advanceRequests} onAdvanceStatusChange={handleAdvanceStatusChange} />
        </TabsContent>
      <TabsContent value="reports" className="mt-6">
        <ReportsTab expenses={expenses} />
      </TabsContent>
      <TabsContent value="payroll" className="mt-6">
        <PayrollTab employees={employees} expenses={expenses} />
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

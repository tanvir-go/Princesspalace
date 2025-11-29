
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

// --- Components ---

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
                                    const advance = expenses.find(
                                        (exp) => exp.category === 'salary-advance' && exp.employeeId === emp.id
                                    );
                                    const advanceAmount = advance ? advance.amount : 0;
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


export default function FinancePage() {
  const [employees, setEmployees] = useState(initialMockEmployees);
  const [expenses, setExpenses] = useState(initialMockExpenses);

  const handleAddExpense = (newExpense: any) => {
    setExpenses(prev => [...prev, newExpense]);
  };

  return (
    <Tabs defaultValue="expenses" className="w-full">
        <Card>
            <CardHeader>
                <CardTitle>Finance & Accounts</CardTitle>
                <CardDescription>Manage expenses, payroll, and view financial reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="payroll">Payroll</TabsTrigger>
                </TabsList>
            </CardContent>
        </Card>
      <TabsContent value="expenses" className="mt-6">
        <ExpenseForm employees={employees} onAddExpense={handleAddExpense} />
        <ExpenseList expenses={expenses} />
      </TabsContent>
      <TabsContent value="reports" className="mt-6">
        <ReportsTab expenses={expenses} />
      </TabsContent>
      <TabsContent value="payroll" className="mt-6">
        <PayrollTab employees={employees} expenses={expenses} />
      </TabsContent>
    </Tabs>
  );
}

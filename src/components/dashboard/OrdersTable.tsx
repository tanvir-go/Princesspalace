
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Printer } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import type { Order } from "@/lib/types";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

interface OrdersTableProps {
  orders: Order[];
  title?: string;
  description?: string;
}

export function OrdersTable({ 
  orders: initialOrders, 
  title = "Orders", 
  description = "A list of recent orders from your restaurant." 
}: OrdersTableProps) {
  const db = useFirestore();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);
  
  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    if (!db) return;

    const orderDocRef = doc(db, "orders", orderId);
    
    updateDoc(orderDocRef, { status: newStatus })
      .then(() => {
        console.log(`Order ${orderId} status changed to ${newStatus}`);
        // The real-time listener from useCollection will update the UI automatically.
      })
      .catch(err => {
         errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
              path: orderDocRef.path,
              operation: 'update',
              requestResourceData: { status: newStatus },
            })
          );
      });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "Kitchen Pending":
        return "destructive";
      case "Ready to Pay":
        return "secondary";
      case "Served":
        return "outline";
      default:
        return "secondary";
    }
  };

  const handlePrintBill = (order: Order) => {
    const now = new Date();
    const createdAtDate = order.createdAt ? (order.createdAt as any).toDate() : now;

    const printContent = `
        <div style="font-family: monospace; width: 300px; padding: 10px; margin: auto;">
            <h2 style="text-align: center; margin: 0; font-size: 1.5rem;">Princesspalace</h2>
            <p style="text-align: center; font-size: 0.8rem; border-bottom: 1px dashed black; padding-bottom: 10px;">${order.tableNumber > 0 ? 'Dine-In Bill' : 'Takeaway Bill'}</p>
            <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                <span><strong>Bill No:</strong> ${order.id.slice(-6).toUpperCase()}</span>
                <span><strong>Date:</strong> ${createdAtDate.toLocaleDateString()}</span>
            </div>
             <div style="display: flex; justify-content: space-between;">
                 <span><strong>Table:</strong> ${order.tableNumber > 0 ? order.tableNumber : 'Takeaway'}</span>
                 <span><strong>Time:</strong> ${createdAtDate.toLocaleTimeString()}</span>
            </div>
            ${order.userName ? `<div><strong>Customer:</strong> ${order.userName}</div>` : ''}
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
                    ${order.items.map(item => `
                        <tr>
                            <td style="padding: 2px;">${item.name}</td>
                            <td style="text-align: center; padding: 2px;">${item.quantity}</td>
                            <td style="text-align: right; padding: 2px;">${formatPrice(item.price)}</td>
                            <td style="text-align: right; padding: 2px;">${formatPrice(item.price * item.quantity)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <hr style="border-top: 1px dashed black; margin: 10px 0;">
            <table style="width: 100%;">
                <tbody>
                    <tr><td>Subtotal:</td><td style="text-align:right;">${formatPrice(order.total)}</td></tr>
                </tbody>
            </table>
            <hr style="border-top: 1px solid black; margin: 10px 0;">
            <h3 style="text-align: right; font-size: 1.2rem;">Total: ${formatPrice(order.total)}</h3>
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
    }
  };

  const isCustomer = user?.role === 'customer';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              { !isCustomer && <TableHead className="hidden sm:table-cell">Table</TableHead> }
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              { !isCustomer && <TableHead><span className="sr-only">Actions</span></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const createdAtDate = order.createdAt ? (order.createdAt as any).toDate() : new Date();
              return (
                <TableRow key={order.id}>
                    <TableCell>
                    <div className="font-medium">{order.id.slice(-6).toUpperCase()}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                        {createdAtDate.toLocaleDateString()}
                    </div>
                    </TableCell>
                    { !isCustomer && <TableCell className="hidden sm:table-cell">{order.tableNumber > 0 ? order.tableNumber : 'Takeaway'}</TableCell> }
                    <TableCell className="hidden sm:table-cell">
                    <Badge className="text-xs" variant={getStatusVariant(order.status)}>
                        {order.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-right">৳{order.total.toFixed(2)}</TableCell>
                    { !isCustomer && (
                        <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => console.log('View Details for', order.id)}>View Details</DropdownMenuItem>
                            
                            <DropdownMenuItem onClick={() => handlePrintBill(order)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print Bill
                            </DropdownMenuItem>
                            
                            {order.status !== 'Completed' && (
                                <>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                {order.status !== 'Served' && order.status !== 'Ready to Pay' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Served')}>Mark as Served</DropdownMenuItem>
                                )}
                                {order.status !== 'Ready to Pay' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Ready to Pay')}>Mark as Ready to Pay</DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Completed')}>Mark as Completed</DropdownMenuItem>
                                </>
                            )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{Math.min(orders.length, 10)}</strong> of <strong>{orders.length}</strong> orders
          </div>
        </CardFooter>
    </Card>
  );
}

    
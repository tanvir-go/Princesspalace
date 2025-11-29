"use client";

import { useCollection } from "@/firebase";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { type Order } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderManagementPage() {
    const { data: orders, loading } = useCollection<Order>('orders');
    
    const sortedOrders = orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        )
    }
    
    return (
        <OrdersTable 
            orders={sortedOrders}
            title="Order Management"
            description="View and manage all incoming and active orders."
        />
    );
}

"use client";

import { Activity, CreditCard, DollarSign, ShoppingCart } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { stats } from '@/lib/dashboard-data';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { RecentSales } from '@/components/dashboard/RecentSales';
import { OrdersTable } from '@/components/dashboard/OrdersTable';
import { useAuth, useCollection } from '@/firebase';
import type { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';
import { query, where } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const iconMap: { [key: string]: React.ReactElement } = {
  DollarSign: <DollarSign className="h-4 w-4 text-muted-foreground" />,
  ShoppingCart: <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
  CreditCard: <CreditCard className="h-4 w-4 text-muted-foreground" />,
  Activity: <Activity className="h-4 w-4 text-muted-foreground" />,
};

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Create a query that filters orders by the current user's ID
  const userOrdersQuery = useMemo(() => {
    if (!user?.uid) return null;
    return query(where('userId', '==', user.uid));
  }, [user?.uid]);

  const { data: orders, loading: ordersLoading } = useCollection<Order>('orders', userOrdersQuery);
  
  const recentOrders = useMemo(() => orders
    .sort((a, b) => {
        const dateA = a.createdAt ? (a.createdAt as any).toDate() : new Date(0);
        const dateB = b.createdAt ? (b.createdAt as any).toDate() : new Date(0);
        return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 10), [orders]);

  // If the user is a customer, show only their orders
  if (user?.role === 'customer') {
    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {user.displayName}!</CardTitle>
                    <CardDescription>Here you can track your orders.</CardDescription>
                </CardHeader>
                <CardContent>
                    {ordersLoading ? (
                        <Skeleton className="h-96 w-full" />
                    ) : (
                        <OrdersTable orders={recentOrders} title="Your Orders" description="A list of your recent orders and their status." />
                    )}
                </CardContent>
            </Card>
        </div>
    )
  }

  // Original dashboard for other roles
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={iconMap[stat.icon]}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4">
            <RevenueChart />
        </div>
        <div className="lg:col-span-3">
            <RecentSales />
        </div>
      </div>
      <div>
        {ordersLoading ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <OrdersTable orders={recentOrders.slice(0,5)} title="Recent Orders" description="A list of the 5 most recent orders." />
        )}
      </div>
    </div>
  );
}

    
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { recentSales } from "@/lib/dashboard-data";

export function RecentSales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
         <CardDescription>You made 265 sales this month.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {recentSales.map((sale) => (
          <div key={sale.email} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={`https://avatar.vercel.sh/${sale.avatar}.png`} alt="Avatar" />
              <AvatarFallback>{sale.avatar}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">{sale.name}</p>
              <p className="text-sm text-muted-foreground">{sale.email}</p>
            </div>
            <div className="ml-auto font-medium">{sale.amount}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

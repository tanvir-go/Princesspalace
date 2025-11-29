
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import uomData from "@/lib/uom.json";
import { useAuth } from "@/hooks/use-auth";

export type Purchase = {
    id: string;
    purchaseDate: string;
    item: string;
    quantity: number;
    uom: string;
    rate: number;
    total: number;
    status: 'Pending' | 'Approved' | 'Rejected';
    submittedBy: string;
};

interface PurchaseEntryFormProps {
    onSubmit: (purchase: Purchase) => void;
}

export function PurchaseEntryForm({ onSubmit }: PurchaseEntryFormProps) {
    const { user } = useAuth();
    const [date, setDate] = useState<Date>(new Date());
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [uom, setUom] = useState('');
    const [rate, setRate] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const q = parseFloat(quantity);
        const r = parseFloat(rate);
        if (!isNaN(q) && !isNaN(r)) {
            setTotal(q * r);
        } else {
            setTotal(0);
        }
    }, [quantity, rate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPurchase: Purchase = {
            id: `pur-${Date.now()}`,
            purchaseDate: date.toISOString(),
            item,
            quantity: parseFloat(quantity),
            uom,
            rate: parseFloat(rate),
            total,
            status: 'Pending',
            submittedBy: user?.displayName || 'Unknown',
        };
        onSubmit(newPurchase);

        // Reset form
        setDate(new Date());
        setItem('');
        setQuantity('');
        setUom('');
        setRate('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Purchase Entry</CardTitle>
                <CardDescription>Record a new item that has been purchased.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Purchase Date</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(d) => setDate(d || new Date())}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="item-name">Item Name</Label>
                            <Input id="item-name" value={item} onChange={(e) => setItem(e.target.value)} required />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="uom">UOM</Label>
                            <Select value={uom} onValueChange={setUom} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select UOM" />
                                </SelectTrigger>
                                <SelectContent>
                                    {uomData.map(u => <SelectItem key={u.symbol} value={u.symbol}>{u.name} ({u.symbol})</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rate">Rate (per unit)</Label>
                            <Input id="rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="total">Total</Label>
                            <Input id="total" type="number" value={total.toFixed(2)} readOnly className="bg-muted" />
                        </div>
                    </div>
                    <Button type="submit" className="w-full">Submit for Approval</Button>
                </form>
            </CardContent>
        </Card>
    )
}

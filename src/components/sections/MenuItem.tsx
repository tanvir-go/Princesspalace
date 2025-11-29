
"use client";

import { type MenuItem as MenuItemType, Price } from "@/lib/menu-data";
import { formatPrice } from "@/lib/utils";
import { Button } from "../ui/button";
import { Heart, ChevronRight, Utensils, Phone, MessageCircle } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";


interface MenuItemProps {
  item: MenuItemType;
}

export function MenuItem({ item }: MenuItemProps) {
  const { toast } = useToast();
  const [selectedSize, setSelectedSize] = useState<string | null>(
    typeof item.price !== "number" ? Object.keys(item.price)[0] : null
  );

  const getPrice = (price: Price, size: string | null): number => {
    if (typeof price === "number") {
      return price;
    }
    return size ? price[size] : 0;
  };

  const handleOrderNowClick = (e: React.MouseEvent) => {
     if (typeof item.price !== 'number' && !selectedSize) {
      e.preventDefault();
      toast({
        variant: "destructive",
        title: "Please select an option",
        description: `You must select a size for ${item.name}.`,
      });
      return;
    }
     if (getPrice(item.price, selectedSize) === 0) {
      e.preventDefault();
      toast({
        variant: "destructive",
        title: "Item Unavailable",
        description: `${item.name} is currently unavailable.`,
      });
      return;
    }
  };
  
  const phoneNumber = "+8801646497530";
  const whatsappMessage = `Hello, I'd like to order: ${item.name}${selectedSize ? ` (Size: ${selectedSize})` : ''}`;
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="group bg-neutral-800 rounded-3xl text-white pt-24 p-6 relative flex flex-col justify-between">
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
        <Utensils className="w-12 h-12 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
      </div>

      <div className="flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold font-headline">{item.name}</h3>
            {item.bengaliName && (
              <p className="text-sm text-neutral-400">{item.bengaliName}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-neutral-700 hover:text-white rounded-full"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {item.description && (
          <p className="text-sm text-neutral-400 mb-4 flex-grow">
            {item.description}
          </p>
        )}

        {typeof item.price !== "number" && (
          <div className="mb-4">
            <Select
              value={selectedSize || ""}
              onValueChange={setSelectedSize}
            >
              <SelectTrigger className="w-full bg-neutral-700 border-neutral-600">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(item.price).map(([size, price]) => (
                  <SelectItem key={size} value={size}>
                    {size} - {formatPrice(price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold">
          {formatPrice(getPrice(item.price, selectedSize))}
        </span>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button onClick={handleOrderNowClick} className="rounded-lg w-36">
              Order Now
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
              <AlertDialogDescription>
                To place your order for <strong>{item.name}{selectedSize ? ` (${selectedSize})` : ''}</strong>, please contact us via phone or WhatsApp.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="my-4 p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">Call or message us at:</p>
              <p className="text-2xl font-bold tracking-wider">{phoneNumber}</p>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Link href={whatsappUrl} target="_blank" className="bg-green-500 hover:bg-green-600">
                  <MessageCircle className="mr-2 h-4 w-4" /> Order on WhatsApp
                </Link>
              </AlertDialogAction>
              <AlertDialogAction asChild>
                <a href={`tel:${phoneNumber}`}>
                  <Phone className="mr-2 h-4 w-4" /> Call to Order
                </a>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

"use client";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type MenuCategory, type MenuItem as MenuItemType } from "@/lib/menu-data";
import { formatPrice } from "@/lib/utils";
import { PlusCircle } from "lucide-react";

interface MenuItemCardProps {
  category: MenuCategory;
}

export function MenuItemCard({ category }: MenuItemCardProps) {
  return (
    <AccordionItem value={category.title}>
      <AccordionTrigger className="p-6">
        <div className="text-left">
          <h3 className="text-2xl font-headline">{category.title}</h3>
          <p className="text-sm text-muted-foreground">{category.description}</p>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-6 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.items.map((item: MenuItemType) => (
            <div key={item.name} className="border p-4 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-lg">{item.name}</h4>
                  <p className="font-semibold text-primary text-lg">
                    {formatPrice(item.price)}
                  </p>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add to Order
                </Button>
              </div>
            </div>
          ))}
          {category.notes && (
            <div className="md:col-span-2 lg:col-span-3 mt-4">
              <p className="text-sm text-muted-foreground italic">{category.notes}</p>
            </div>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

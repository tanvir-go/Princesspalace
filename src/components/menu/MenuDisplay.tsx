"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type MenuCategory, type MenuItem as MenuItemType } from "@/lib/menu-data";
import { MenuItemCard } from "./MenuItemCard";

interface MenuDisplayProps {
  menuData: MenuCategory[];
}

export function MenuDisplay({ menuData }: MenuDisplayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategories, setActiveCategories] = useState<string[]>(
    menuData.map((category) => category.title)
  );

  const filteredMenuData = menuData
    .map((category) => {
      const filteredItems = category.items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { ...category, items: filteredItems };
    })
    .filter((category) => category.items.length > 0);

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Menu Management</CardTitle>
          <CardDescription>
            Browse, search, and manage all menu items.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="mt-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for a dish..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      </div>

      <Accordion
        type="multiple"
        value={activeCategories}
        onValueChange={setActiveCategories}
        className="w-full space-y-4"
      >
        {filteredMenuData.map((category) => (
          <Card key={category.title}>
            <MenuItemCard category={category} />
          </Card>
        ))}
      </Accordion>
    </div>
  );
}

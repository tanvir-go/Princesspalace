
'use client';

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menuData } from "@/lib/menu-data";
import { MenuItem } from "./MenuItem";
import { Soup, ShoppingBag, Box, Flame, Utensils, Salad, Pizza, Coffee, GlassWater, IceCream, Beef, Grape, Sandwich, CakeSlice } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categoryIcons: { [key: string]: React.ElementType } = {
    "Appetizers": Utensils,
    "Sharma & Sub Sandwich": Sandwich,
    "Soup": Soup,
    "Set Menu & Platters": ShoppingBag,
    "Burger & Sandwich": Sandwich,
    "Meat Box": Box,
    "Oven Baked Pasta": Flame,
    "South Indian Biryani": Utensils,
    "Thali & Hospoch": Beef,
    "Salad": Salad,
    "Dessert": CakeSlice,
    "Pizza": Pizza,
    "Family Combo": ShoppingBag,
    "Family Order": Utensils,
    "Hot & Cold Coffee": Coffee,
    "Milkshake": IceCream,
    "Juices": Grape,
    "Drinks & Water": GlassWater,
    "Chap, Kabab & Naan": Beef
};


export function Menu() {
    const [selectedCategory, setSelectedCategory] = useState(menuData[0].title);
    
    return (
        <section id="menu" className="w-full py-12 md:py-24 lg:py-32 bg-background">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-12">
                    <p className="font-body text-primary uppercase tracking-[0.2em]">Our Menu</p>
                    <h2 className="font-headline text-4xl md:text-5xl font-bold mt-2">Explore Our Dishes</h2>
                </div>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                    
                    {/* Mobile Dropdown */}
                    <div className="md:hidden mb-6">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-full h-12 text-base">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {menuData.map(category => (
                                    <SelectItem key={category.title} value={category.title}>
                                        {category.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Desktop Tabs */}
                    <TabsList className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-2 h-auto text-gray-100 p-2 backdrop-blur-xl bg-black/40 border border-white/5 shadow-2xl">
                        {menuData.map(category => {
                            const Icon = categoryIcons[category.title] || Utensils;
                            return (
                                <TabsTrigger key={category.title} value={category.title} className="flex flex-col items-center justify-center gap-2 p-3 w-full h-24">
                                    <Icon className="h-6 w-6" />
                                    <span className="text-xs text-center">{category.title}</span>
                                </TabsTrigger>
                            )
                        })}
                    </TabsList>
                    
                    {menuData.map(category => (
                        <TabsContent key={category.title} value={category.title}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-24 mt-24">
                                {category.items.map(item => (
                                    <MenuItem key={item.name} item={item} />
                                ))}
                            </div>
                            {category.notes && (
                                <p className="text-center text-sm text-muted-foreground mt-8 italic">{category.notes}</p>
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
}

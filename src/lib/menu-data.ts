export type Price = number | { [key: string]: number };

export interface MenuItem {
  name: string;
  bengaliName?: string;
  price: Price;
  description?: string;
}

export interface MenuCategory {
  title: string;
  description: string;
  items: MenuItem[];
  notes?: string;
}

export const menuData: MenuCategory[] = [
  {
    title: "Appetizers",
    description: "Start your meal with our delicious appetizers.",
    items: [
      { name: "French Fries", bengaliName: "ফ্রেঞ্চ ফ্রাই", price: 200 },
      { name: "Fried Wonton (6 pcs)", bengaliName: "ফ্রাইড ওয়ানটন (৬ পিস)", price: 150 },
      { name: "Thai Fried Chicken", bengaliName: "থাই ফ্রাইড চিকেন", price: 100 },
      { name: "Crispy Fried Chicken", bengaliName: "ক্রিস্পি ফ্রাইড চিকেন", price: 110 },
      { name: "Tandoori Chicken", price: 170 },
      { name: "Smoked Garlic Mushroom", price: 210 },
      { name: "Potato Wedges", price: 160 },
      { name: "B.B.Q Hot Wings (6 pcs)", price: 220 },
      { name: "Naga Hot Wings (6 pcs)", price: 230 },
      { name: "Special Fried Wonton (6 pcs)", price: 160 },
      { name: "Cheese Toast (6 pcs)", price: 160 },
    ],
  },
  {
    title: "Sharma & Sub Sandwich",
    description: "Flavorful wraps and loaded sub sandwiches.",
    items: [
      { name: "Chicken Roll Sharma", price: 160 },
      { name: "Beef Roll Sharma", price: 200 },
      { name: "Chicken Sub Sandwich", price: 170 },
      { name: "Chicken Cheese Sub Sandwich", price: 200 },
      { name: "Regular Chicken Sandwich", price: 120 },
      { name: "Smoked Club Sandwich (4pcs)", price: 200 },
    ],
  },
  {
    title: "Soup",
    description: "Warm and comforting soups to delight your senses.",
    items: [
      { name: "Vegetable Soup", price: { "1:1": 100, "1:3": 280 } },
      { name: "Thai Soup", price: { "1:1": 120, "1:3": 350 } },
      { name: "Thai Clear Soup", price: { "1:1": 150, "1:3": 420 } },
      { name: "Corn Soup", price: { "1:1": 110, "1:3": 320 } },
      { name: "Sweet & Sour Soup", price: { "1:1": 120, "1:3": 350 } },
      { name: "Special Korean Ramen Soup", price: 320 },
    ],
  },
  {
    title: "Set Menu & Platters",
    description: "Curated meals and platters for a complete dining experience.",
    items: [
      {
        name: "Set Menu (1)",
        price: 300,
        description:
          "Egg Fried Rice, Tandoori Chicken, Chinese Vegetables, Salad & Drinks.",
      },
      {
        name: "Set Menu (2)",
        price: 240,
        description:
          "Egg Fried Rice, Fried Chicken, Chinese Vegetables, Salad & Drinks.",
      },
      {
        name: "Set Menu (3)",
        price: 250,
        description:
          "Egg Fried Rice, Thai Fried Chicken, Chinese Vegetables, Salad & Drinks.",
      },
      {
        name: "Platters (1)",
        price: 350,
        description: "Smoked Boneless Chicken, Grill Mushroom Vegetable",
      },
      {
        name: "Platters (2)",
        price: 360,
        description: "Chicken Mushroom Pasta with Creamy Gravy",
      },
      {
        name: "Platters (3)",
        price: 320,
        description:
          "Chef Special Cheese Noodles served with Chicken, Mushroom, Vegetable Salad.",
      },
    ],
  },
  {
    title: "Burger & Sandwich",
    description: "Juicy burgers and classic sandwiches.",
    items: [
      { name: "Classic Chicken Burger", price: 200 },
      { name: "Cheese Booms Burger", price: 250 },
      { name: "Crispy Burger", price: 160 },
      { name: "Beef Burger", price: 200 },
      { name: "Extra Slide Cheese", price: 30 },
    ],
  },
  {
    title: "Meat Box",
    description: "A box full of meaty goodness.",
    items: [
      { name: "Regular Meat Box", price: 200 },
      { name: "B.B.Q Meat Box", price: 230 },
      { name: "Naga Meat Box", price: 250 },
    ],
  },
  {
    title: "Oven Baked Pasta",
    description: "Cheesy and delicious oven-baked pasta dishes.",
    items: [
      { name: "Italian Pasta (Chicken, Mushroom)", price: 300 },
      { name: "Pasta Basta (Chicken)", price: 320 },
      { name: "Naga Pasta (Chicken)", price: 330 },
      { name: "White Pasta (Chicken)", price: 300 },
      { name: "P.P Special Pasta (Chicken, Beef)", price: 360 },
      { name: "Vegetable Pasta", price: 280 },
    ],
  },
  {
    title: "South Indian Biryani",
    description: "Aromatic and flavorful biryani from the south.",
    items: [
      { name: "Grill Bucket Biryani (1:2) (Chicken 6 pcs)", price: 530 },
      { name: "Mutton Biryani (Mutton 2 pcs)", price: 350 },
      { name: "Chicken Handi Biryani", price: 340 },
      { name: "Kababy Biryani", price: 420 },
      { name: "Beef Biryani (Beef 2 pcs)", price: 310 },
      {
        name: "Special Biryani (Chicken 1 pcs, Mutton 1 pcs, Beef 1 pcs)",
        price: 410,
      },
    ],
  },
  {
    title: "Thali & Hospoch",
    description: "Traditional thali and hospoch meals.",
    items: [
      {
        name: "Thali (A)",
        price: 420,
        description: "(Plain Polao, Chicken Roast, Beef Rezala)",
      },
      {
        name: "Thali (B)",
        price: 450,
        description: "(Plain Polao, Chicken Roast, Mutton Rezala)",
      },
      { name: "Chicken Hospoch", price: 210 },
      { name: "Beef Hospoch", price: 260 },
      { name: "Mutton Hospoch", price: 320 },
      { name: "Hospoch with Tandoori Chicken", price: 300 },
    ],
  },
  {
    title: "Salad",
    description: "Fresh and healthy salads.",
    items: [
      { name: "Green Healthy Salad", price: 180 },
      { name: "Chicken Cashewnut Salad", price: 350 },
    ],
  },
  {
    title: "Dessert",
    description: "Sweet treats to end your meal.",
    items: [
      { name: "Faluda", price: 150 },
      { name: "Ice-Cream Faluda", price: 200 },
      { name: "Fruit Custard", price: 160 },
    ],
  },
  {
    title: "Pizza",
    description: "Classic and specialty pizzas, available in three sizes.",
    items: [
      {
        name: "Chicken Lovers",
        price: { S: 520, M: 620, L: 750 },
        description:
          "Special Tomato Souce, Imported Mozzarella Cheese, Chicken, Capsicum, Tomato",
      },
      {
        name: "Couple Choice",
        price: { S: 580, M: 700, L: 800 },
        description:
          "Special Tomato Souce, Imported Mozzarella Cheese, Beef, Capsicum, Tomato",
      },
      {
        name: "Four Season",
        price: { S: 560, M: 670, L: 810 },
        description:
          "Special Tomato Souce, Imported Mozzarella Cheese, Chicken, Beef, Capsicum, Tomato, Black Olive, Mushroom",
      },
      {
        name: "B.B.Q Station",
        price: { S: 620, M: 730, L: 820 },
        description:
          "Special Tomato Souce, Imported Mozzarella Cheese, Chicken, Capsicum, Tomato, B.B.Q Souce",
      },
      {
        name: "Chocolate Kids Pizza",
        price: { S: 630, M: 730, L: 850 },
        description: "Chocolate Souce, Imported Mozzarella Cheese, Chocolate",
      },
      {
        name: "Sausage Blast",
        price: { S: 540, M: 640, L: 830 },
        description:
          "Special Tomato Souce, Imported Mozzarella Cheese, Chicken Sausage, Capsicum, Tomato, Black Olive",
      },
      { name: "Extra Added Imported Mozzarella Cheese", price: 150 },
    ],
  },
  {
    title: "Family Combo",
    description: "Great value combos for the whole family.",
    items: [
      {
        name: "Combo (A)",
        price: 360,
        description: "Fried/Thai Chicken 02 pcs, French Fries, 01 Drinks",
      },
      {
        name: "Combo (B)",
        price: 580,
        description: "Fried/Thai Chicken 04 pcs, French Fries, 02 Drinks",
      },
      {
        name: "Combo (C)",
        price: 270,
        description: "Fried Wings 04 pcs, French Fries, 01 Drinks",
      },
      {
        name: "Combo (D)",
        price: 250,
        description: "Chicken Pop 04 pcs, French Fries, 01 Drinks",
      },
      {
        name: "Party Combo (E)",
        price: 2500,
        description:
          "Fried Chicken 06 pcs, Classic Chicken Burger 03 pcs, Italian Pasta 02 pcs, Chicken Lovers Pizza 12”",
      },
    ],
  },
  {
    title: "Family Order",
    description: "Main and side dishes for family-style dining.",
    items: [
      { name: "Egg Fried Rice", price: { "1:1": 100, "1:2": 200, "1:3": 300 } },
      {
        name: "Mixed Fried Rice",
        price: { "1:1": 160, "1:2": 310, "1:3": 460 },
      },
      {
        name: "Mixed Vegetable",
        price: { "1:1": 100, "1:2": 190, "1:3": 290 },
      },
      { name: "Mixed Chawmin", price: { "1:2": 260, "1:3": 510 } },
      { name: "Plain Pulao", price: { "1:2": 240, "1:3": 350 } },
      { name: "Hospoch", price: { "1:2": 220, "1:3": 320 } },
      { name: "Chicken Chilli Onion", price: { "1:2": 320, "1:3": 460 } },
      { name: "Beef Chilli Onion", price: { "1:2": 360, "1:3": 530 } },
      { name: "Chicken Sizling (Egg Fried Rice)", price: 580 },
      { name: "Beef Sizling (Egg Fried Rice)", price: 740 },
      { name: "Desi Chicken Fry (8 pcs)", price: 520 },
      { name: "Desi Chicken Jhal Fry (8 pcs)", price: 550 },
      { name: "Beef Bhuna", price: { "1:1": 250, "1:3": 730 } },
      { name: "Prawn Masala", price: { "1:1": 300, "1:3": 850 } },
      { name: "Desi Chicken Roast Full (4 pcs)", price: 550 },
    ],
  },
  {
    title: "Hot & Cold Coffee",
    description: "A selection of coffee to refresh you.",
    items: [
      { name: "Expresso Hot Coffee", price: 80 },
      { name: "Chocolate Coffee", price: 100 },
      { name: "Black Coffee", price: 60 },
      { name: "Cold Coffee", price: 150 },
      { name: "Ice Coffee", price: 120 },
    ],
  },
  {
    title: "Milkshake",
    description: "Creamy and delicious milkshakes.",
    items: [
      { name: "Chocolate Milkshake", price: 150 },
      { name: "Strawberry Milkshake", price: 150 },
      { name: "Vanilla Milkshake", price: 150 },
      { name: "Mango Milkshake", price: 150 },
      { name: "Banana Milkshake", price: 150 },
      { name: "Oreo Milkshake", price: 170 },
    ],
  },
  {
    title: "Juices",
    description: "Freshly squeezed juices.",
    items: [
      { name: "Mango Juice", price: 120 },
      { name: "Green Mango Juice", price: 120 },
      { name: "Papaya Juice", price: 130 },
      { name: "Pineapple Juice", price: 140 },
      { name: "Wattermelon Juice", price: 120 },
      { name: "Orange Juice", price: 140 },
      { name: "Lemon Juice", price: 100 },
      { name: "Lemonade", price: 120 },
    ],
  },
  {
    title: "Drinks & Water",
    description: "Stay hydrated.",
    items: [
      { name: "Drinks", price: 0, description: "As per body price" },
      { name: "Water", price: 0, description: "As per body price" },
    ],
    notes: 'Price entered manually as per body price.',
  },
  {
    title: "Chap, Kabab & Naan",
    description: "Grilled kababs and freshly baked naan.",
    items: [
      { name: "Chicken Malai Kabab (4 pcs)", price: 200 },
      { name: "Chicken Tikka Kabab (4 pcs)", price: 180 },
      { name: "Chicken Tandoori Kabab (1 pcs)", price: 170 },
      { name: "Beef Tikka Kabab (1 order)", price: 250 },
      { name: "Chicken Chap (1 pcs)", price: 180 },
      { name: "Chicken Chap Masala", price: 240 },
      { name: "Chicken Malai Curry (4 pcs)", price: 250 },
      { name: "Chicken Tikka Masala (4 pcs)", price: 240 },
      { name: "Chicken Tandoori Kabab Masala (4 pcs)", price: 250 },
      { name: "Plan Naan", price: 30 },
      { name: "Garlic Naan", price: 50 },
      { name: "Till Naan", price: 60 },
      { name: "P.P. Special Naan", price: 70 },
      { name: "Naan Extra Cheese", price: 50 },
      { name: "Luchi", price: 20 },
    ],
  },
];

    
    
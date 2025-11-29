
export type Order = {
  id: string;
  userId?: string;
  userName?: string;
  tableNumber: number;
  status: 'Kitchen Pending' | 'Served' | 'Ready to Pay' | 'Completed';
  items: { name: string; price: number; quantity: number }[];
  total: number;
  createdAt: string; // This can be a Firestore Timestamp on the backend
  paymentMethod?: string;
};

    
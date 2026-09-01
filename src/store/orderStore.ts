import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "@/store/addressStore";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Omit<Address, "id" | "userId" | "isDefault">;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "razorpay";
  paymentStatus: "completed";
  orderStatus: "confirmed";
  createdAt: string;
};

type OrderStore = {
  orders: Order[];
  placeOrder: (data: {
    userId: string;
    items: OrderItem[];
    shippingAddress: Omit<Address, "id" | "userId" | "isDefault">;
    subtotal: number;
    tax: number;
    total: number;
  }) => Order;
  ordersFor: (userId: string) => Order[];
  getOrder: (id: string) => Order | undefined;
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      placeOrder: (data) => {
        const nextSequence = 105 + get().orders.length;
        const order: Order = {
          ...data,
          id: crypto.randomUUID(),
          orderNumber: `ORD-2026-${nextSequence}`,
          paymentMethod: "razorpay",
          paymentStatus: "completed",
          orderStatus: "confirmed",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        return order;
      },
      ordersFor: (userId) => get().orders.filter((o) => o.userId === userId),
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "cr-orders" }
  )
);

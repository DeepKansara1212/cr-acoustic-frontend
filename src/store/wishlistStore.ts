import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistStore = {
  productIds: string[];
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) => {
        const has = get().productIds.includes(productId);
        set((s) => ({
          productIds: has
            ? s.productIds.filter((id) => id !== productId)
            : [...s.productIds, productId],
        }));
        return !has;
      },
      remove: (productId) =>
        set((s) => ({ productIds: s.productIds.filter((id) => id !== productId) })),
      has: (productId) => get().productIds.includes(productId),
    }),
    { name: "cr-wishlist" }
  )
);

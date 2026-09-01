import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Address = {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type AddressStore = {
  addresses: Address[];
  addressesFor: (userId: string) => Address[];
  addAddress: (userId: string, data: Omit<Address, "id" | "userId" | "isDefault">) => Address;
  removeAddress: (id: string) => void;
  setDefault: (userId: string, id: string) => void;
};

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: [],
      addressesFor: (userId) => get().addresses.filter((a) => a.userId === userId),
      addAddress: (userId, data) => {
        const existing = get().addressesFor(userId);
        const address: Address = {
          ...data,
          id: crypto.randomUUID(),
          userId,
          isDefault: existing.length === 0,
        };
        set((s) => ({ addresses: [...s.addresses, address] }));
        return address;
      },
      removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
      setDefault: (userId, id) =>
        set((s) => ({
          addresses: s.addresses.map((a) =>
            a.userId === userId ? { ...a, isDefault: a.id === id } : a
          ),
        })),
    }),
    { name: "cr-addresses" }
  )
);

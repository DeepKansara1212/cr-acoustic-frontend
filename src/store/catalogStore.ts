import { create } from "zustand";
import api from "@/lib/api";

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  badge?: "New" | "Sale" | "Best Seller";
  stock: number;
  image?: string;
  isFeatured?: boolean;
};

export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  isActive?: boolean;
};

const normalizeProduct = (raw: any): CatalogProduct => ({
  id: raw?._id || raw?.id,
  name: raw?.name || "Untitled product",
  slug: raw?.slug || raw?.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "product",
  shortDescription: raw?.shortDescription || raw?.fullDescription || "",
  price: Number(raw?.price || 0),
  comparePrice: raw?.comparePrice ? Number(raw.comparePrice) : undefined,
  category: raw?.category?.name || raw?.category || "Uncategorized",
  brand: raw?.brand || "CR Acoustic",
  rating: Number(raw?.averageRating || 0),
  reviewCount: Number(raw?.reviewCount || 0),
  badge: raw?.badge || (raw?.isFeatured ? "New" : undefined),
  stock: Number(raw?.stock || 0),
  image: raw?.images?.[0]?.url,
  isFeatured: Boolean(raw?.isFeatured),
});

const normalizeCategory = (raw: any): CatalogCategory => ({
  id: raw?._id || raw?.id,
  name: raw?.name || "Category",
  slug: raw?.slug || raw?.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "category",
  icon: raw?.icon || "AudioWaveform",
  description: raw?.description,
  isActive: raw?.isActive ?? true,
});

type CatalogStore = {
  products: CatalogProduct[];
  categories: CatalogCategory[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => CatalogProduct | undefined;
  getProductBySlug: (slug: string) => CatalogProduct | undefined;
};

export const useCatalogStore = create<CatalogStore>((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    try {
      const { data } = await api.get("/categories?includeInactive=true");
      const items = Array.isArray(data?.data) ? data.data : data?.data?.categories || [];
      set({ categories: items.map(normalizeCategory) });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch categories" });
    }
  },
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.get("/products?limit=100&sort=newest");
      const items = Array.isArray(data?.data?.products) ? data.data.products : data?.data || [];
      set({ products: items.map(normalizeProduct), loading: false });
    } catch (error: any) {
      set({ error: error?.message || "Failed to fetch products", loading: false });
    }
  },
  getProductById: (id) => get().products.find((product) => product.id === id),
  getProductBySlug: (slug) => get().products.find((product) => product.slug === slug),
}));

export const ensureCatalogLoaded = async () => {
  const store = useCatalogStore.getState();
  if (!store.products.length) await store.fetchProducts();
  if (!store.categories.length) await store.fetchCategories();
};

import { create } from "zustand";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { handleUnauthorizedError } from "../utils/handleUnauthorizedError";

interface Product {
  product_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ProductStore {
  data: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalData: number;

  loadAll: (page?: number, limit?: number) => Promise<void>;
  getOne: (id: number) => Promise<void>;
  addOne: (payload: Partial<Product>) => Promise<void>;
  updateOne: (id: number, payload: Partial<Product>) => Promise<void>;
  deleteOne: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  data: [],
  currentProduct: null,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  totalData: 0,

  loadAll: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await getAllProducts(page, limit);
      const { data, totalData } = res.data;
      set({ data, totalData, page, limit, loading: false });
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  getOne: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await getProductById(id);
      set({ currentProduct: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  addOne: async (payload) => {
    set({ loading: true, error: null });
    try {
      await createProduct(payload);
      await useProductStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  updateOne: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      await updateProduct(id, payload);
      await useProductStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  deleteOne: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteProduct(id);
      await useProductStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },
}));

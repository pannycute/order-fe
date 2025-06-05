// src/stores/orderStore.ts
import { create } from "zustand";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/ordersService";
import { handleUnauthorizedError } from "../utils/handleUnauthorizedError";

interface Order {
  order_id: number;
  user_id: number;
  order_date: string; // ISO date format
  status: string;
  total_amount: number;
}

interface OrderStore {
  data: Order[];
  currentItem: Order | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalData: number;

  loadAll: (page?: number, limit?: number) => Promise<void>;
  getOne: (order_id: number) => Promise<void>;
  addOne: (payload: Partial<Order>) => Promise<void>;
  updateOne: (order_id: number, payload: Partial<Order>) => Promise<void>;
  deleteOne: (order_id: number) => Promise<void>;
}

export const useOrderStore = create<OrderStore>((set) => ({
  data: [],
  currentItem: null,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  totalData: 0,

  loadAll: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await getAllOrders(page, limit);
      const { data, totalData } = res.data;
      set({ data, totalData, page, limit, loading: false });
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  getOne: async (order_id) => {
    set({ loading: true, error: null });
    try {
      const res = await getOrderById(order_id);
      set({ currentItem: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  addOne: async (payload) => {
    set({ loading: true, error: null });
    try {
      await createOrder(payload);
      await useOrderStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  updateOne: async (order_id, payload) => {
    set({ loading: true, error: null });
    try {
      await updateOrder(order_id, payload);
      await useOrderStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  deleteOne: async (order_id) => {
    set({ loading: true, error: null });
    try {
      await deleteOrder(order_id);
      await useOrderStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },
}));

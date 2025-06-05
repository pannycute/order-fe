// src/stores/orderItemStore.ts
import { create } from "zustand";
import {
  getAllOrderItems,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from "../services/orderItemsService";
import { handleUnauthorizedError } from "../utils/handleUnauthorizedError";

interface OrderItem {
  order_item_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderItemStore {
  data: OrderItem[];
  currentItem: OrderItem | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalData: number;

  loadAll: (page?: number, limit?: number) => Promise<void>;
  getOne: (order_item_id: number) => Promise<void>;
  addOne: (payload: Partial<OrderItem>) => Promise<void>;
  updateOne: (
    order_item_id: number,
    payload: Partial<OrderItem>
  ) => Promise<void>;
  deleteOne: (order_item_id: number) => Promise<void>;
}

export const useOrderItemStore = create<OrderItemStore>((set) => ({
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
      const res = await getAllOrderItems(page, limit);
      const { data, totalData } = res.data;
      set({ data, totalData, page, limit, loading: false });
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  getOne: async (order_item_id) => {
    set({ loading: true, error: null });
    try {
      const res = await getOrderItemById(order_item_id);
      set({ currentItem: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  addOne: async (payload) => {
    set({ loading: true, error: null });
    try {
      await createOrderItem(payload);
      await useOrderItemStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  updateOne: async (order_item_id, payload) => {
    set({ loading: true, error: null });
    try {
      await updateOrderItem(order_item_id, payload);
      await useOrderItemStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  deleteOne: async (order_item_id) => {
    set({ loading: true, error: null });
    try {
      await deleteOrderItem(order_item_id);
      await useOrderItemStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },
}));

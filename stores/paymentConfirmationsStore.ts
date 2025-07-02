import { create } from "zustand";
import { getAllPaymentConfirmations, getPaymentConfirmationById } from "../services/paymentConfirmationsService";

export interface PaymentConfirmation {
  confirmation_id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface Store {
  data: PaymentConfirmation[];
  currentConfirmation: PaymentConfirmation | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalData: number;

  loadAll: (page?: number, limit?: number) => Promise<void>;
  getOne: (id: number) => Promise<void>;
}

export const usePaymentConfirmationStore = create<Store>((set) => ({
  data: [],
  currentConfirmation: null,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  totalData: 0,

  loadAll: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await getAllPaymentConfirmations(page, limit);
      const { data, totalData } = res.data;
      set({ data, totalData, page, limit, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load data", loading: false });
    }
  },

  getOne: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await getPaymentConfirmationById(id);
      set({ currentConfirmation: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to load detail", loading: false });
    }
  },
}));

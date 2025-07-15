import { create } from "zustand";
import { getAllPaymentConfirmations, getPaymentConfirmationById, confirmPayment, rejectPayment } from "../services/paymentConfirmationsService";
import { PaymentConfirmation } from "../types";

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
  confirmPayment: (id: number) => Promise<void>;
  rejectPayment: (id: number) => Promise<void>;
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

  confirmPayment: async (id) => {
    set({ loading: true, error: null });
    try {
      await confirmPayment(id);
      // Reload data after confirmation
      const res = await getAllPaymentConfirmations(1, 10);
      const { data, totalData } = res.data;
      set({ data, totalData, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to confirm payment", loading: false });
    }
  },

  rejectPayment: async (id) => {
    set({ loading: true, error: null });
    try {
      await rejectPayment(id);
      // Reload data after rejection
      const res = await getAllPaymentConfirmations(1, 10);
      const { data, totalData } = res.data;
      set({ data, totalData, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Failed to reject payment", loading: false });
    }
  },
}));

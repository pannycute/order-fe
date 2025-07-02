// @/stores/paymentmethodStore.ts
import { create } from "zustand";
import {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../services/paymentMethodService";

export interface PaymentMethod {
  payment_method_id: number;
  method_name: string;
  details: string | null;
}

interface PaymentMethodStore {
  data: PaymentMethod[];
  currentPaymentMethod: PaymentMethod | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalData: number;

  loadAll: (page?: number, limit?: number) => Promise<void>;
  getOne: (id: number) => Promise<void>;
  addOne: (payload: Partial<PaymentMethod>) => Promise<void>;
  updateOne: (id: number, payload: Partial<PaymentMethod>) => Promise<void>;
  deleteOne: (id: number) => Promise<void>;
}

export const usePaymentMethodStore = create<PaymentMethodStore>((set) => ({
  data: [],
  currentPaymentMethod: null,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  totalData: 0,

  loadAll: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await getAllPaymentMethods(page, limit);
      const { data, totalData } = res.data;
      set({ data, totalData, page, limit, loading: false });
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to fetch payment methods";
      set({ error: message, loading: false });
    }
  },

  getOne: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await getPaymentMethodById(id);
      set({ currentPaymentMethod: res.data.data, loading: false });
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to fetch payment method";
      set({ error: message, loading: false });
    }
  },

  addOne: async (payload) => {
    set({ loading: true, error: null });
    try {
      await createPaymentMethod(payload);
      await usePaymentMethodStore.getState().loadAll();
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to create payment method";
      set({ error: message, loading: false });
    }
  },

  updateOne: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      await updatePaymentMethod(id, payload);
      await usePaymentMethodStore.getState().loadAll();
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to update payment method";
      set({ error: message, loading: false });
    }
  },

  deleteOne: async (id) => {
    set({ loading: true, error: null });
    try {
      await deletePaymentMethod(id);
      await usePaymentMethodStore.getState().loadAll();
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to delete payment method";
      set({ error: message, loading: false });
    }
  },
}));
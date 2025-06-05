import { create } from "zustand";
import {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../services/paymentMethodService";
import { handleUnauthorizedError } from "../utils/handleUnauthorizedError";

interface PaymentMethod {
  payment_method_id: number;
  method_name: string;
  details: string;
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
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  getOne: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await getPaymentMethodById(id);
      set({ currentPaymentMethod: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  addOne: async (payload) => {
    set({ loading: true, error: null });
    try {
      await createPaymentMethod(payload);
      await usePaymentMethodStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  updateOne: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      await updatePaymentMethod(id, payload);
      await usePaymentMethodStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  deleteOne: async (id) => {
    set({ loading: true, error: null });
    try {
      await deletePaymentMethod(id);
      await usePaymentMethodStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },
}));

// src/stores/paymentConfirmationStore.ts
import { create } from "zustand";
import {
  getAllPaymentConfirmations,
  getPaymentConfirmationById,
  createPaymentConfirmation,
  updatePaymentConfirmation,
  deletePaymentConfirmation,
} from "../services/paymentConfirmationsService";
import { handleUnauthorizedError } from "../utils/handleUnauthorizedError";

interface PaymentConfirmation {
  confirmation_id: number;
  order_id: number;
  payment_method_id: number;
  amount: number;
  confirmation_date: string; // ISO format datetime
  status: "pending" | "approved" | "rejected";
  proof_image: string;
}

interface PaymentConfirmationStore {
  data: PaymentConfirmation[];
  currentItem: PaymentConfirmation | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalData: number;

  loadAll: (page?: number, limit?: number) => Promise<void>;
  getOne: (confirmation_id: number) => Promise<void>;
  addOne: (payload: Partial<PaymentConfirmation>) => Promise<void>;
  updateOne: (
    confirmation_id: number,
    payload: Partial<PaymentConfirmation>
  ) => Promise<void>;
  deleteOne: (confirmation_id: number) => Promise<void>;
}

export const usePaymentConfirmationStore = create<PaymentConfirmationStore>(
  (set) => ({
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
        const res = await getAllPaymentConfirmations(page, limit);
        const { data, totalData } = res.data;
        set({ data, totalData, page, limit, loading: false });
      } catch (err: any) {
        set({ error: err.response.data.message, loading: false });
        handleUnauthorizedError(err);
      }
    },

    getOne: async (confirmation_id) => {
      set({ loading: true, error: null });
      try {
        const res = await getPaymentConfirmationById(confirmation_id);
        set({ currentItem: res.data.data, loading: false });
      } catch (err: any) {
        set({ error: err.response.data.message, loading: false });
        handleUnauthorizedError(err);
      }
    },

    addOne: async (payload) => {
      set({ loading: true, error: null });
      try {
        await createPaymentConfirmation(payload);
        await usePaymentConfirmationStore.getState().loadAll();
      } catch (err: any) {
        set({ error: err.response.data.message, loading: false });
        handleUnauthorizedError(err);
      }
    },

    updateOne: async (confirmation_id, payload) => {
      set({ loading: true, error: null });
      try {
        await updatePaymentConfirmation(confirmation_id, payload);
        await usePaymentConfirmationStore.getState().loadAll();
      } catch (err: any) {
        set({ error: err.response.data.message, loading: false });
        handleUnauthorizedError(err);
      }
    },

    deleteOne: async (confirmation_id) => {
      set({ loading: true, error: null });
      try {
        await deletePaymentConfirmation(confirmation_id);
        await usePaymentConfirmationStore.getState().loadAll();
      } catch (err: any) {
        set({ error: err.response.data.message, loading: false });
        handleUnauthorizedError(err);
      }
    },
  })
);

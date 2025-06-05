import { create } from "zustand";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";
import { handleUnauthorizedError } from "../utils/handleUnauthorizedError";

export interface User {
  user_id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  [key: string]: any;
}

export interface UserStore {
  data: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalData: number;

  loadAll: (page?: number, limit?: number) => Promise<void>;
  getOne: (id: number) => Promise<void>;
  addOne: (payload: Partial<User>) => Promise<void>;
  updateOne: (id: number, payload: Partial<User>) => Promise<void>;
  deleteOne: (id: number) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  data: [],
  currentUser: null,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  totalData: 0,

  loadAll: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await getAllUsers(page, limit);
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
      const res = await getUserById(id);
      set({ currentUser: res.data.data, loading: false });
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  addOne: async (payload) => {
    set({ loading: true, error: null });
    try {
      await createUser(payload);
      await useUserStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  updateOne: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      await updateUser(id, payload);
      await useUserStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },

  deleteOne: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteUser(id);
      await useUserStore.getState().loadAll();
    } catch (err: any) {
      set({ error: err.response.data.message, loading: false });
      handleUnauthorizedError(err);
    }
  },
}));

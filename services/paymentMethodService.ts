// @/services/paymentmethodService.ts
import { axiosInstance } from "../utils/axiosInstance";

const baseURL = "/paymentmethods";

export const getAllPaymentMethods = (page = 1, limit = 10) =>
  axiosInstance.get(`${baseURL}?page=${page}&limit=${limit}`);

export const getPaymentMethodById = (id: number | string) =>
  axiosInstance.get(`${baseURL}/${id}`);

export const createPaymentMethod = (data: any) =>
  axiosInstance.post(baseURL, data);

export const updatePaymentMethod = (id: number | string, data: any) =>
  axiosInstance.put(`${baseURL}/${id}`, data);

export const deletePaymentMethod = (id: number | string) =>
  axiosInstance.delete(`${baseURL}/${id}`);
// src/services/paymentConfirmationsService.ts
import { axiosInstance } from "../utils/axiosInstance";

const baseURL = "/paymentconfirmations";

export const getAllPaymentConfirmations = (page = 1, limit = 10) =>
  axiosInstance.get(`${baseURL}?page=${page}&limit=${limit}`);

export const getPaymentConfirmationById = (confirmation_id: number | string) =>
  axiosInstance.get(`${baseURL}/${confirmation_id}`);

export const createPaymentConfirmation = (data: any) =>
  axiosInstance.post(baseURL, data);

export const updatePaymentConfirmation = (
  confirmation_id: number | string,
  data: any
) => axiosInstance.put(`${baseURL}/${confirmation_id}`, data);

export const deletePaymentConfirmation = (confirmation_id: number | string) =>
  axiosInstance.delete(`${baseURL}/${confirmation_id}`);

export const confirmPayment = (confirmation_id: number | string) =>
  axiosInstance.patch(`${baseURL}/${confirmation_id}/confirm`);

export const rejectPayment = (confirmation_id: number | string) =>
  axiosInstance.patch(`${baseURL}/${confirmation_id}/reject`);

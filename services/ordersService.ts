// src/services/ordersService.ts
import { axiosInstance } from "../utils/axiosInstance";

const baseURL = "/orders";

export const getAllOrders = (page = 1, limit = 10) =>
  axiosInstance.get(`${baseURL}?page=${page}&limit=${limit}`);

export const getOrderById = (order_id: number | string) =>
  axiosInstance.get(`${baseURL}/${order_id}`);

export const createOrder = (data: any) => axiosInstance.post(baseURL, data);

export const updateOrder = (order_id: number | string, data: any) =>
  axiosInstance.put(`${baseURL}/${order_id}`, data);

export const deleteOrder = (order_id: number | string) =>
  axiosInstance.delete(`${baseURL}/${order_id}`);

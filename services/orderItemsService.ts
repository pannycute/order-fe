// src/services/orderItemsService.ts
import { axiosInstance } from "../utils/axiosInstance";

const baseURL = "/orderitems";

export const getAllOrderItems = (page = 1, limit = 10) =>
  axiosInstance.get(`${baseURL}?page=${page}&limit=${limit}`);

export const getOrderItemById = (order_item_id: number | string) =>
  axiosInstance.get(`${baseURL}/${order_item_id}`);

export const createOrderItem = (data: any) => axiosInstance.post(baseURL, data);

export const updateOrderItem = (order_item_id: number | string, data: any) =>
  axiosInstance.put(`${baseURL}/${order_item_id}`, data);

export const deleteOrderItem = (order_item_id: number | string) =>
  axiosInstance.delete(`${baseURL}/${order_item_id}`);

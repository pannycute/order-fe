import { axiosInstance } from "../utils/axiosInstance";

const baseURL = "/products";

export const getAllProducts = (page = 1, limit = 10) =>
  axiosInstance.get(`${baseURL}?page=${page}&limit=${limit}`);

export const getProductById = (id: number | string) =>
  axiosInstance.get(`${baseURL}/${id}`);

export const createProduct = (data: any) => axiosInstance.post(baseURL, data);

export const updateProduct = (id: number | string, data: any) =>
  axiosInstance.put(`${baseURL}/${id}`, data);

export const deleteProduct = (id: number | string) =>
  axiosInstance.delete(`${baseURL}/${id}`);

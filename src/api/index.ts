import axios from 'axios';
import { Order, OrderStatus, Product } from '../types';

const API_URL = 'https://fakestoreapi.com';

const api = axios.create({
  baseURL: API_URL,
});

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await api.get('/carts');
  // Fake Store API doesn't have status field, so we'll add it randomly
  return response.data.map((order: any) => ({
    ...order,
    status: ['pending', 'paid', 'shipped'][Math.floor(Math.random() * 3)] as OrderStatus,
  }));
};

export const fetchOrder = async (id: string): Promise<Order> => {
  const response = await api.get(`/carts/${id}`);
  // Add status field
  return {
    ...response.data,
    status: ['pending', 'paid', 'shipped'][Math.floor(Math.random() * 3)] as OrderStatus,
  };
};

export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order> => {
  // In a real app, we would use PATCH, but Fake Store API doesn't support updating status
  // So we'll simulate it with a GET and then pretend we updated it
  const response = await api.get(`/carts/${id}`);
  return {
    ...response.data,
    status,
  };
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const fetchProducts = async (ids: number[]): Promise<Product[]> => {
  const promises = ids.map(id => fetchProduct(id));
  return Promise.all(promises);
};
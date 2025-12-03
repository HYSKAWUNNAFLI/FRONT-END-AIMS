import { api } from './api';
import { products as mockProducts } from '../data/products';
import type { Paginated, Product, Category } from '../types';

export type ListParams = {
  page?: number;
  size?: number;
  search?: string;
  category?: Category | 'All';
  priceMin?: number;
  priceMax?: number;
  sort?: 'title' | 'priceAsc' | 'priceDesc';
};

const mapPaginated = (data: Paginated<Product> | Product[]): Paginated<Product> => {
  if (Array.isArray(data)) {
    return { items: data, page: 1, size: data.length, total: data.length };
  }
  return data;
};

export async function listProducts(params: ListParams = {}): Promise<Paginated<Product>> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.size) query.set('size', String(params.size));
    if (params.search) query.set('search', params.search);
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.priceMin !== undefined) query.set('priceMin', String(params.priceMin));
    if (params.priceMax !== undefined) query.set('priceMax', String(params.priceMax));
    if (params.sort) query.set('sort', params.sort);
    const data = await api.fetchJson<Paginated<Product>>(`/products?${query.toString()}`);
    return mapPaginated(data);
  } catch (err) {
    // fallback to mock data
    const { page = 1, size = mockProducts.length } = params;
    const start = (page - 1) * size;
    const items = mockProducts.slice(start, start + size);
    return { items, page, size, total: mockProducts.length };
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    return await api.fetchJson<Product>(`/products/${id}`);
  } catch (err) {
    return mockProducts.find(p => p.id === id) ?? null;
  }
}

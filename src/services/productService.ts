import { apiClient } from "./api";
import { products as mockProducts } from "../data/products";
import type { Paginated, Product, Category, ProductInput } from "../types";

export type ListParams = {
  page?: number;
  size?: number;
  search?: string;
  category?: Category | "All";
  priceMin?: number;
  priceMax?: number;
  sort?: "title" | "priceAsc" | "priceDesc";
};

let localProducts: Product[] = [...mockProducts];

const mapPaginated = (data: Paginated<Product> | Product[]): Paginated<Product> => {
  if (Array.isArray(data)) {
    return { items: data, page: 1, size: data.length, total: data.length };
  }
  return data;
};

export async function listProducts(
  params: ListParams = {}
): Promise<Paginated<Product>> {
  try {
    // Convert 1-based page to 0-based for backend
    const backendPage = params.page ? params.page - 1 : 0;

    const response = await apiClient.get<Paginated<Product>>("/products", {
      params: {
        page: backendPage,
        size: params.size || 20,
        search: params.search,
        category: params.category !== "All" ? params.category : undefined,
        priceMin: params.priceMin,
        priceMax: params.priceMax,
        sort: params.sort,
      },
    });

    return mapPaginated(response.data);
  } catch (err) {
    // fallback to mock data
    const { page = 1, size = localProducts.length } = params;
    const start = (page - 1) * size;
    const items = localProducts.slice(start, start + size);
    return { items, page, size, total: localProducts.length };
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  } catch (err) {
    return localProducts.find((p) => p.id === id) ?? null;
  }
}

export async function createProduct(payload: ProductInput): Promise<Product> {
  try {
    const response = await apiClient.post<Product>("/admin/products", payload);
    return response.data;
  } catch (err) {
    const newProduct: Product = {
      ...payload,
      id: payload.id || `local-${Date.now()}`,
    } as Product;
    localProducts = [newProduct, ...localProducts];
    return newProduct;
  }
}

export async function updateProduct(id: string, payload: ProductInput): Promise<Product> {
  try {
    const response = await apiClient.put<Product>(`/admin/products/${id}`, payload);
    return response.data;
  } catch (err) {
    localProducts = localProducts.map((p) => (p.id === id ? { ...p, ...payload, id } : p));
    const updated = localProducts.find((p) => p.id === id);
    return updated as Product;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await apiClient.delete(`/admin/products/${id}`);
  } catch (err) {
    // ignore
  } finally {
    localProducts = localProducts.filter((p) => p.id !== id);
  }
}

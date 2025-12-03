import { apiClient } from "./api";
import { products as mockProducts } from "../data/products";
import type { Paginated, Product, Category } from "../types";

export type ListParams = {
  page?: number;
  size?: number;
  search?: string;
  category?: Category | "All";
  priceMin?: number;
  priceMax?: number;
  sort?: "title" | "priceAsc" | "priceDesc";
};

const mapPaginated = (
  data: Paginated<Product> | Product[]
): Paginated<Product> => {
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
    const { page = 1, size = mockProducts.length } = params;
    const start = (page - 1) * size;
    const items = mockProducts.slice(start, start + size);
    return { items, page, size, total: mockProducts.length };
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  } catch (err) {
    return mockProducts.find((p) => p.id === id) ?? null;
  }
}

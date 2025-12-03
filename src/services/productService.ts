import { apiClient } from "./api";
import { products as mockProducts } from "../data/products";
import type { Paginated, Product, Category } from "../types";

// Backend response types
type BackendProduct = {
  id: number;
  productType: "BOOK" | "CD" | "NEWSPAPER" | "DVD";
  status: string;
  barcode: string;
  title: string;
  category: string;
  conditionLabel: string;
  dominantColor?: string;
  returnPolicy?: string;
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
  originalValue: number;
  currentPrice: number;
  stock: number;
  bookDetail?: {
    id: number;
    authors?: string;
    coverType?: string;
    publisher?: string;
    publishDate?: string;
    pageCount?: number;
    language?: string;
    genre?: string;
  };
  newspaperDetail?: {
    id: number;
    publisher?: string;
    issueDate?: string;
    language?: string;
    genre?: string;
  };
  cdDetail?: {
    id: number;
    artist?: string;
    label?: string;
    releaseDate?: string;
    trackCount?: number;
    genre?: string;
  };
  dvdDetail?: {
    id: number;
    director?: string;
    studio?: string;
    releaseDate?: string;
    runtime?: number;
    genre?: string;
  };
};

type BackendResponse = {
  success: boolean;
  message: string;
  data: {
    items: BackendProduct[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
};

// Map backend product type to frontend Category
const typeToCategory: Record<BackendProduct["productType"], Category> = {
  BOOK: "Book",
  CD: "CD",
  NEWSPAPER: "Newspaper",
  DVD: "DVD",
};

// Map backend product to frontend Product model
function mapBackendProduct(p: BackendProduct): Product {
  const category = typeToCategory[p.productType] || "Book";

  // Extract genre from the appropriate detail object
  const genre =
    p.bookDetail?.genre ||
    p.cdDetail?.genre ||
    p.dvdDetail?.genre ||
    p.newspaperDetail?.genre ||
    p.category || // fallback to backend category field
    "General";

  // Build details object based on product type
  let details: Record<string, string | number> = {};

  if (p.bookDetail) {
    details = {
      author: p.bookDetail.authors || "Unknown",
      publisher: p.bookDetail.publisher || "Unknown",
      pages: p.bookDetail.pageCount || 0,
      language: p.bookDetail.language || "Unknown",
      publishDate: p.bookDetail.publishDate || "Unknown",
    };
  } else if (p.cdDetail) {
    details = {
      artist: p.cdDetail.artist || "Unknown",
      label: p.cdDetail.label || "Unknown",
      tracks: p.cdDetail.trackCount || 0,
      release: p.cdDetail.releaseDate || "Unknown",
    };
  } else if (p.dvdDetail) {
    details = {
      director: p.dvdDetail.director || "Unknown",
      studio: p.dvdDetail.studio || "Unknown",
      runtime: p.dvdDetail.runtime ? `${p.dvdDetail.runtime} min` : "Unknown",
      release: p.dvdDetail.releaseDate || "Unknown",
    };
  } else if (p.newspaperDetail) {
    details = {
      publisher: p.newspaperDetail.publisher || "Unknown",
      issueDate: p.newspaperDetail.issueDate || "Unknown",
      language: p.newspaperDetail.language || "Unknown",
    };
  }

  return {
    id: String(p.id),
    title: p.title,
    category,
    genre,
    price: p.currentPrice / 1000, // Convert VND to USD (assuming 1:1000 conversion for display)
    stock: p.stock,
    image: `https://via.placeholder.com/400x300/${
      p.dominantColor?.toLowerCase().replace(/\s/g, "") || "cccccc"
    }/ffffff?text=${encodeURIComponent(p.title)}`,
    shortDesc:
      p.returnPolicy ||
      `${p.conditionLabel} condition, ${category.toLowerCase()} item`,
    details,
  };
}

export type ListParams = {
  page?: number;
  size?: number;
  search?: string;
  category?: Category | "All";
  priceMin?: number;
  priceMax?: number;
  sort?: "title" | "priceAsc" | "priceDesc";
};

export async function listProducts(
  params: ListParams = {}
): Promise<Paginated<Product>> {
  try {
    // Convert 1-based page to 0-based for backend
    const backendPage = params.page ? params.page - 1 : 0;

    const response = await apiClient.get<BackendResponse>("/products", {
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

    // Extract the inner data object from backend response
    const apiData = response.data.data;

    // Map backend products to frontend Product model
    const items = apiData.items.map(mapBackendProduct);

    return {
      items,
      page: apiData.page + 1, // Convert 0-based to 1-based for frontend
      size: apiData.size,
      total: apiData.totalElements,
    };
  } catch (err) {
    console.warn("Failed to fetch products from API, using mock data:", err);
    // fallback to mock data
    const { page = 1, size = mockProducts.length } = params;
    const start = (page - 1) * size;
    const items = mockProducts.slice(start, start + size);
    return { items, page, size, total: mockProducts.length };
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await apiClient.get<BackendResponse>(`/products/${id}`);
    // Backend returns single product wrapped in same response structure
    const apiData = response.data.data;

    // If data is an object (single product), map it
    if (apiData && !Array.isArray(apiData)) {
      return mapBackendProduct(apiData as any);
    }

    // If data has items array, get first item
    if (
      apiData &&
      Array.isArray((apiData as any).items) &&
      (apiData as any).items.length > 0
    ) {
      return mapBackendProduct((apiData as any).items[0]);
    }

    return null;
  } catch (err) {
    console.warn("Failed to fetch product from API, using mock data:", err);
    return mockProducts.find((p) => p.id === id) ?? null;
  }
}

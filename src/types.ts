export type Category = 'Book' | 'CD' | 'Newspaper' | 'DVD';

export type Product = {
  id: string;
  title: string;
  category: Category;
  genre: string;
  price: number; // exclude VAT
  stock: number;
  image: string;
  shortDesc: string;
  details?: Record<string, string | number>;
};

export type ProductInput = Omit<Product, 'id'> & { id?: string };

export type Paginated<T> = {
  items: T[];
  page: number;
  size: number;
  total: number;
};

export type CartItem = {
  productId: string;
  qty: number;
};

export type DeliveryInfo = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  note?: string;
};

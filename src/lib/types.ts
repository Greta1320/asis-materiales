export interface Category {
  id: string;
  name: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category_id: string | null;
  image_url: string | null;
  in_stock: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined
  categories?: Category | null;
}

export interface CartItem {
  product: Product;
  qty: number;
}

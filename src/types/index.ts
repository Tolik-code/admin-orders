export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'paid' | 'shipped';

export interface Order {
  id: number;
  userId: number;
  date: string;
  products: CartItem[];
  status: OrderStatus;
}

export interface OrderWithProducts extends Order {
  productDetails?: Product[];
}
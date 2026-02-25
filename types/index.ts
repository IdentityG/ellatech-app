export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  quantity: number;
  createdAt: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  type: "ADD" | "REMOVE";
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  timestamp: string;
  performedBy: string; 
}

export interface AppState {
  users: User[];
  products: Product[];
  transactions: Transaction[];
  currentUser: User | null;
}
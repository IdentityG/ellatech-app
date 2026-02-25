import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, Product, Transaction, AppState } from "../types";
import { generateId } from "../utils/helpers";


interface AppContextValue extends AppState {
  registerUser: (
    email: string,
    fullName: string
  ) => { success: boolean; message: string };
  setCurrentUser: (user: User | null) => void;

  registerProduct: (
    sku: string,
    name: string,
    price: number,
    quantity: number
  ) => { success: boolean; message: string };

  adjustStock: (
    productId: string,
    type: "ADD" | "REMOVE",
    amount: number
  ) => { success: boolean; message: string };

  paginatedTransactions: (page: number, pageSize: number) => Transaction[];
  totalPages: (pageSize: number) => number;
}


const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);


  useEffect(() => {
    const demo: User = {
      id: generateId(),
      email: "egnuma@ellatech.io",
      fullName: "Egnuma Gelana",
      createdAt: new Date().toISOString(),
    };
    setUsers([demo]);
    setCurrentUser(demo);
  }, []);

  const registerUser = (
    email: string,
    fullName: string
  ): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();

    if (!trimmedEmail || !trimmedName) {
      return { success: false, message: "All fields are required." };
    }

    const duplicate = users.find((u) => u.email === trimmedEmail);
    if (duplicate) {
      return {
        success: false,
        message: "A user with this email already exists.",
      };
    }

    const newUser: User = {
      id: generateId(),
      email: trimmedEmail,
      fullName: trimmedName,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);


    if (!currentUser) setCurrentUser(newUser);

    return { success: true, message: "User registered successfully." };
  };

  const registerProduct = (
    sku: string,
    name: string,
    price: number,
    quantity: number
  ): { success: boolean; message: string } => {
    const trimmedSku = sku.trim().toUpperCase();
    const trimmedName = name.trim();

    if (!trimmedSku || !trimmedName) {
      return { success: false, message: "SKU and name are required." };
    }

    const duplicate = products.find((p) => p.sku === trimmedSku);
    if (duplicate) {
      return {
        success: false,
        message: `Product with SKU "${trimmedSku}" already exists.`,
      };
    }

    const now = new Date().toISOString();
    const newProduct: Product = {
      id: generateId(),
      sku: trimmedSku,
      name: trimmedName,
      price,
      quantity,
      createdAt: now,
      lastUpdated: now,
    };

    setProducts((prev) => [...prev, newProduct]);

    if (currentUser) {
      const tx: Transaction = {
        id: generateId(),
        productId: newProduct.id,
        productSku: newProduct.sku,
        productName: newProduct.name,
        type: "ADD",
        quantity,
        quantityBefore: 0,
        quantityAfter: quantity,
        unitPrice: price,
        timestamp: now,
        performedBy: currentUser.email,
      };
      setTransactions((prev) => [tx, ...prev]);
    }

    return { success: true, message: "Product registered successfully." };
  };

  const adjustStock = (
    productId: string,
    type: "ADD" | "REMOVE",
    amount: number
  ): { success: boolean; message: string } => {
    if (!currentUser) {
      return {
        success: false,
        message: "You must be logged in to adjust stock.",
      };
    }

    if (amount <= 0) {
      return { success: false, message: "Amount must be greater than zero." };
    }

    const product = products.find((p) => p.id === productId);
    if (!product) {
      return { success: false, message: "Product not found." };
    }

    if (type === "REMOVE" && product.quantity < amount) {
      return {
        success: false,
        message: `Cannot remove ${amount} units. Only ${product.quantity} in stock.`,
      };
    }

    const quantityBefore = product.quantity;
    const quantityAfter =
      type === "ADD" ? quantityBefore + amount : quantityBefore - amount;
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, quantity: quantityAfter, lastUpdated: now }
          : p
      )
    );

    const tx: Transaction = {
      id: generateId(),
      productId,
      productSku: product.sku,
      productName: product.name,
      type,
      quantity: amount,
      quantityBefore,
      quantityAfter,
      unitPrice: product.price,
      timestamp: now,
      performedBy: currentUser.email,
    };
    setTransactions((prev) => [tx, ...prev]);

    return {
      success: true,
      message: `Stock ${type === "ADD" ? "added" : "removed"} successfully.`,
    };
  };

  const paginatedTransactions = (
    page: number,
    pageSize: number
  ): Transaction[] => {
    const start = (page - 1) * pageSize;
    return transactions.slice(start, start + pageSize);
  };

  const totalPages = (pageSize: number): number => {
    return Math.max(1, Math.ceil(transactions.length / pageSize));
  };

  return (
    <AppContext.Provider
      value={{
        users,
        products,
        transactions,
        currentUser,
        setCurrentUser,
        registerUser,
        registerProduct,
        adjustStock,
        paginatedTransactions,
        totalPages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
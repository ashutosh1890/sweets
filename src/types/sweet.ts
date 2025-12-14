export interface Sweet {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
}

export interface Order {
  id: string;
  user_id: string;
  sweet_id: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type SweetCategory = 
  | 'Chocolates'
  | 'Gummies'
  | 'Hard Candy'
  | 'Lollipops'
  | 'Caramels'
  | 'Mints'
  | 'Fudge';

export const SWEET_CATEGORIES: SweetCategory[] = [
  'Chocolates',
  'Gummies',
  'Hard Candy',
  'Lollipops',
  'Caramels',
  'Mints',
  'Fudge',
];

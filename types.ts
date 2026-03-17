
export enum Category {
  STUDENT = 'Student',
  BUSINESS = 'Business',
  PROGRAMMING = 'Programming',
  GAMING = 'Gaming',
  PREMIUM = 'Premium',
  BUDGET = 'Budget'
}

export interface Laptop {
  id: string;
  name: string;
  brand: string;
  specs: string;
  description?: string;
  detailedSpecs?: string[];
  price: number;
  originalPrice: number;
  category: Category;
  image: string;
  moreImages?: string[];
  condition: 'UK-Used' | 'New';
  isBestForSchool?: boolean;
  youtubeUrl?: string;
}

export interface CartItem extends Laptop {
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
}

export enum OrderStatus {
  ORDERS = 'ORDERS',
  IN_PROGRESS = 'IN PROGRESS',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod?: string;
  idImage?: string;
  status: OrderStatus;
  createdAt: string;
}

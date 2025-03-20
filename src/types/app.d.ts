
export interface Destination {
  id: string;
  title: string;
  image: string;
  price: string;
  priceValue: number;
  rating: number;
  location: string;
  reviews: Review[];
  description?: string;
  distance?: string;
  travelTime?: string;
}

export interface Review {
  id?: string;
  author: string;
  comment: string;
  rating: number;
  date: string;
  authorAvatar?: string;
}

export interface Ticket {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  status: "unused" | "used" | "expired";
  qrCode?: string;
  issued: string;
  stops?: string[];
  delay?: string;
}

export interface Profile {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  preferredPayment?: string;
  notifications: boolean;
  favorites: string[];
  points: number;
}

export interface Promotion {
  id: string;
  code: string;
  discount: number;
  description: string;
  expiryDate: string;
  minimumPurchase?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  date: string;
}

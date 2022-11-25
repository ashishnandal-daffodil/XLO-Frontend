import { User } from "./user.interface";

interface unreadMessage {
  userId?: string;
  count?: number;
}

export interface Room {
  name?: string;
  description?: string;
  seller_id?: string;
  buyer_id?: string;
  product_id?: string;
  created_on?: Date;
  updated_on?: Date;
  unread_messages?: unreadMessage[];
}

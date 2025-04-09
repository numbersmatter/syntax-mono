export type OrderStatus = "pending" | "approved" | "waitlisted" | "declined";

export type EventType = "conference" | "workshop" | "seminar" | "webinar";

export type EventStatus =
  | "planning"
  | "open_orders"
  | "open_pickups"
  | "finished";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  eventId: string;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Event {
  id: string;
  name: string;
  type: EventType;
  status: EventStatus;
  date: string;
  description: string;
  image: string;
  capacity: number;
}

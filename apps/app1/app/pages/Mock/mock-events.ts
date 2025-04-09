import type { Event, Order } from "../types";

export const mockEvents: Event[] = [
  {
    id: "e1",
    name: "Tech Innovation Summit 2024",
    type: "conference",
    status: "planning",
    date: "2024-06-15T09:00:00Z",
    description:
      "Annual technology conference showcasing the latest innovations",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000",
    capacity: 200,
  },
  {
    id: "e2",
    name: "Digital Marketing Workshop",
    type: "workshop",
    status: "open_orders",
    date: "2024-04-20T13:00:00Z",
    description: "Hands-on workshop for digital marketing professionals",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000",
    capacity: 50,
  },
  {
    id: "e3",
    name: "Leadership Seminar",
    type: "seminar",
    status: "open_pickups",
    date: "2024-05-10T10:00:00Z",
    description: "Executive leadership development program",
    image:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000",
    capacity: 100,
  },
];

export const mockOrders: Order[] = [
  {
    id: "1",
    eventId: "e1",
    customer: {
      id: "c1",
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
    },
    items: [
      {
        id: "i1",
        name: "Premium Widget",
        quantity: 2,
        price: 29.99,
      },
      {
        id: "i2",
        name: "Basic Gadget",
        quantity: 1,
        price: 19.99,
      },
    ],
    status: "pending",
    total: 79.97,
    createdAt: "2024-03-15T10:30:00Z",
  },
  {
    id: "2",
    eventId: "e1",
    customer: {
      id: "c2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(555) 987-6543",
    },
    items: [
      {
        id: "i3",
        name: "Deluxe Package",
        quantity: 1,
        price: 149.99,
      },
    ],
    status: "approved",
    total: 149.99,
    createdAt: "2024-03-15T11:45:00Z",
  },
];

import type { Order, Event } from "./types";

export const mockEvents: Event[] = [
  {
    id: "e1",
    name: "April 4 Pickup",
    type: "pickup",
    status: "planning",
    date: "2024-06-15T09:00:00Z",
    description:
      "Annual technology conference showcasing the latest innovations",
    image:
      "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&q=80&w=1000",
    capacity: 20,
  },
  {
    id: "e2",
    name: "April 11 DoorDash Orders",
    type: "doordash",
    status: "open_orders",
    date: "2024-04-20T13:00:00Z",
    description: "Weekly DoorDash",
    image:
      "https://images.unsplash.com/photo-1648091855444-76f97897dcd4?auto=format&fit=crop&q=80&w=1000",
    capacity: 53,
  },
  {
    id: "e3",
    name: "April Drivethru",
    type: "drivethru",
    status: "open_pickups",
    date: "2024-05-10T10:00:00Z",
    description: "End of Semester Drive-thru",
    image:
      "https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=1000",
    capacity: 40,
  },
  {
    id: "e4",
    name: "test 4 ",
    type: "drivethru",
    status: "open_pickups",
    date: "2024-05-10T10:00:00Z",
    description: "End of Semester Drive-thru",
    image:
      "https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=1000",
    capacity: 40,
  },
  {
    id: "e5",
    name: "test 5",
    type: "drivethru",
    status: "open_pickups",
    date: "2024-05-10T10:00:00Z",
    description: "End of Semester Drive-thru",
    image:
      "https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=1000",
    capacity: 40,
  },
  {
    id: "e6",
    name: "test 6",
    type: "drivethru",
    status: "open_pickups",
    date: "2024-05-10T10:00:00Z",
    description: "End of Semester Drive-thru",
    image:
      "https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=1000",
    capacity: 40,
  },
  {
    id: "e7",
    name: "test 7",
    type: "drivethru",
    status: "open_pickups",
    date: "2024-05-10T10:00:00Z",
    description: "End of Semester Drive-thru",
    image:
      "https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=1000",
    capacity: 40,
  },
  {
    id: "e8",
    name: "Test 8",
    type: "drivethru",
    status: "open_pickups",
    date: "2024-05-10T10:00:00Z",
    description: "End of Semester Drive-thru",
    image:
      "https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=1000",
    capacity: 40,
  },
  {
    id: "e9",
    name: "test 9",
    type: "drivethru",
    status: "open_pickups",
    date: "2024-05-10T10:00:00Z",
    description: "End of Semester Drive-thru",
    image:
      "https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=1000",
    capacity: 40,
  },
  {
    id: "e10",
    name: "test 10",
    type: "drivethru",
    status: "open_pickups",
    date: "2024-05-10T10:00:00Z",
    description: "End of Semester Drive-thru",
    image:
      "https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=1000",
    capacity: 40,
  },
  {
    id: "e11",
    name: "test 11",
    type: "drivethru",
    status: "open_pickups",
    date: "2024-05-10T10:00:00Z",
    description: "End of Semester Drive-thru",
    image:
      "https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=1000",
    capacity: 40,
  },
  {
    id: "e12",
    name: "test 12",
    type: "drivethru",
    status: "open_pickups",
    date: "2024-05-10T10:00:00Z",
    description: "End of Semester Drive-thru",
    image:
      "https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=1000",
    capacity: 40,
  },
  {
    id: "e13",
    name: "test 13",
    type: "drivethru",
    status: "open_pickups",
    date: "2024-05-10T10:00:00Z",
    description: "End of Semester Drive-thru",
    image:
      "https://images.unsplash.com/photo-1509315703195-529879416a7d?auto=format&fit=crop&q=80&w=1000",
    capacity: 40,
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

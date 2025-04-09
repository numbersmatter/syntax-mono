import { useMemo } from "react";
import { mockOrders } from "~/pages/Mock/mock-events";

export function useOrderStats(eventId: string) {
  const stats = useMemo(() => {
    const eventOrders = mockOrders.filter((order) => order.eventId === eventId);
    return {
      totalOrders: eventOrders.length,
      approvedOrders: eventOrders.filter((order) => order.status === "approved")
        .length,
    };
  }, [eventId]);

  return stats;
}

import { useMemo } from "react";
import { mockOrders } from "~/mock/data";
// import { mockOrders } from "../data";

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

import supabase from "../../config/supabase-config.js";

async function calculateOrderingPatternsAndFrequency(lead_id) {
  try {
    // Fetch orders data from Supabase
    const { data: orders, error } = await supabase
      .from("order-details")
      .select("lead_id, created_at")
      .order("lead_id, created_at", { ascending: true }).eq("lead_id", lead_id);

    if (error) {
      return {
        message: "Failed to fetch orders data",
        error,
        data: [],
      };
    }

    if (!orders || orders.length === 0) {
      return {
        message: "No orders found",
        data: [],
      };
    }

    // Process the orders to calculate patterns and frequencies
    const leadStats = {};

    orders.forEach((order) => {
      const { lead_id, created_at } = order;

      if (!leadStats[lead_id]) {
        leadStats[lead_id] = {
          total_orders: 0,
          first_order_date: new Date(created_at),
          last_order_date: new Date(created_at),
          day_of_week_counts: Array(7).fill(0),
        };
      }

      const lead = leadStats[lead_id];
      const currentOrderDate = new Date(created_at);

      lead.total_orders += 1;
      lead.day_of_week_counts[currentOrderDate.getDay()] += 1;

      if (currentOrderDate < lead.first_order_date) {
        lead.first_order_date = currentOrderDate;
      }
      if (currentOrderDate > lead.last_order_date) {
        lead.last_order_date = currentOrderDate;
      }
    });

    const results = Object.entries(leadStats).map(([lead_id, stats]) => {
      const {
        total_orders,
        first_order_date,
        last_order_date,
        day_of_week_counts,
      } = stats;

      const totalDays =
        (last_order_date - first_order_date) / (1000 * 60 * 60 * 24);
      const avgFrequency =
        total_orders > 1 ? totalDays / (total_orders - 1) : null;

      return {
        lead_id,
        total_orders,
        avg_frequency_in_days: avgFrequency ? avgFrequency.toFixed(2) : "N/A",
        ordering_patterns: day_of_week_counts.map((count, index) => ({
          day: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ][index],
          orders: count,
        })),
      };
    });

    return {
      message: "Ordering patterns and frequency calculated successfully",
      data: results,
    };
  } catch (error) {
    console.error("Error in calculating ordering patterns and frequency:", error);
    return {
      message: "Internal Server Error",
      error,
      data: [],
    };
  }
}

export default calculateOrderingPatternsAndFrequency;


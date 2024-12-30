import supabase from "../../config/supabase-config.js";

const getOrderingPatternsAndFrequency = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from("order-details")
      .select("lead_id, created_at")
      .order("lead_id, created_at", { ascending: true });

    if (error) {
      return res.status(400).json({
        message: "Failed to fetch orders data",
        error,
      });
    }

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No orders found",
      });
    }

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
      const { total_orders, first_order_date, last_order_date, day_of_week_counts } = stats;

      const totalDays =
        (last_order_date - first_order_date) / (1000 * 60 * 60 * 24);
      const avgFrequency = total_orders > 1 ? totalDays / (total_orders - 1) : null;

      return {
        lead_id,
        total_orders,
        avg_frequency_in_days: avgFrequency ? avgFrequency.toFixed(2) : "N/A",
        ordering_patterns: day_of_week_counts.map((count, index) => ({
          day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index],
          orders: count,
        })),
      };
    });

   return res.status(200).json({
      message: "Ordering patterns and frequency fetched successfully",
      data: results,
    });
  } catch (error) {
    console.error("Error in fetching ordering patterns and frequency:", error);
   return res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

export default getOrderingPatternsAndFrequency;

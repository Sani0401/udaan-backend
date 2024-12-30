import supabase from "../../config/supabase-config.js";

const getLeadPerformance = async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from("order-details")
      .select("lead_id, created_at, amount") // Include order_value in the query
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

    for (const order of orders) {
      const { lead_id, created_at, amount } = order;
      const { data: leadDetails, error: leadError } = await supabase
        .from('lead-details')
        .select("name")
        .eq("id", lead_id);

      if (leadError) {
        console.error(`Failed to fetch lead details for lead_id ${lead_id}:`, leadError);
        continue; // Skip this lead if there's an error fetching the name
      }

      const leadName = leadDetails?.[0]?.name || "Unknown Lead";

      if (!leadStats[lead_id]) {
        leadStats[lead_id] = {
          total_orders: 0,
          total_value: 0,
          first_order_date: new Date(created_at),
          last_order_date: new Date(created_at),
          lead_name: leadName, // Add lead name to the stats
        };
      }

      const lead = leadStats[lead_id];
      const currentOrderDate = new Date(created_at);

      lead.total_orders += 1;
      lead.total_value += amount; // Add order value to total_value

      if (currentOrderDate < lead.first_order_date) {
        lead.first_order_date = currentOrderDate;
      }
      if (currentOrderDate > lead.last_order_date) {
        lead.last_order_date = currentOrderDate;
      }
    }

    // Sort leads by total_value in descending order for high-performing
    const sortedLeads = Object.entries(leadStats)
      .map(([lead_id, stats]) => ({
        lead_id,
        ...stats,
      }))
      .sort((a, b) => b.total_value - a.total_value);

    // Get the top 3 high-performing and low-performing leads
    const highPerforming = sortedLeads.slice(0, 3); // Top 3 based on total_value
    const lowPerforming = sortedLeads.slice(-3).reverse(); // Bottom 3 based on total_value

    res.status(200).json({
      message: "Lead performance categorized successfully",
      highPerforming,
      lowPerforming,
    });
  } catch (error) {
    console.error("Error in fetching lead performance:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

export default getLeadPerformance;

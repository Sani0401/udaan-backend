import supabase from "../../config/supabase-config.js";

const getScheduledCalls = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    const { data: callPlans, error: callPlansError } = await supabase
      .from("call-plans")
      .select("lead_id, last_call_date, call_frequency_in_days");

    if (callPlansError) {
      return res
        .status(400)
        .json({ message: "Failed to fetch call plans", error: callPlansError });
    }

    const scheduledTodayLeads = callPlans.filter((plan) => {
      const lastCallDate = new Date(plan.last_call_date);
      const nextScheduledDate = new Date(
        lastCallDate.setDate(lastCallDate.getDate() + plan.call_frequency_in_days)
      );
      return nextScheduledDate.toISOString().split("T")[0] === today;
    });

    const leadIds = scheduledTodayLeads.map((plan) => plan.lead_id);

    const { data: leadDetails, error: leadDetailsError } = await supabase
      .from("lead-details")
      .select("id, name")
      .in("id", leadIds);

    if (leadDetailsError) {
      return res
        .status(400)
        .json({ message: "Failed to fetch lead details", error: leadDetailsError });
    }

    res.status(200).json({
      message: "Scheduled calls for today fetched successfully",
      scheduledCalls: leadDetails,
    });
  } catch (error) {
    console.log("Error in getScheduledCalls:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default getScheduledCalls;

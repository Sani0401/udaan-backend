import supabase from "../../config/supabase-config.js";
import calculateOrderingPatternsAndFrequency from "../../Helper/manager/ordering-patterns.js";
const getLeadById = async (req, res) => {
  try {
    const { lead_id } = req.body; // Change to req.params or req.query if needed

    // Fetch lead details
    const { data: leadDetails, error: leadError } = await supabase
      .from("lead-details")
      .select("*")
      .eq("id", lead_id)
      .single();

    if (leadError || !leadDetails) {
      return res
        .status(400)
        .json({ error: leadError?.message || "Lead not found." });
    }

    // Fetch lead creator details
    const { data: leadCreator, error: leadCreatorError } = await supabase
      .from("account-manager-details")
      .select("name")
      .eq("id", leadDetails.created_by)
      .single();

    if (leadCreatorError) {
      return res.status(400).json({ error: leadCreatorError.message });
    }

    leadDetails.lead_creator = leadCreator?.name || "Unknown";

    // Fetch orders data
    const { data: ordersData, error: ordersError } = await supabase
      .from("order-details")
      .select("*")
      .eq("lead_id", lead_id);

    if (ordersError) {
      return res.status(400).json({ error: ordersError.message });
    }

    // Fetch interaction data
    const { data: interactionData, error: interactionError } = await supabase
      .from("interaction-details")
      .select("*")
      .eq("lead_id", lead_id);

    if (interactionError) {
      return res.status(400).json({ error: interactionError.message });
    }

    // Fetch calls plan data
    const { data: callsPlanData, error: callsPlanError } = await supabase
      .from("call-plans")
      .select("*")
      .eq("lead_id", lead_id);

    if (callsPlanError) {
      return res.status(400).json({ error: callsPlanError.message });
    }

    // Fetch POC data
    const { data: pocData, error: pocError } = await supabase
      .from("user-details")
      .select("*")
      .eq("lead_id", lead_id);

    if (pocError) {
      return res.status(400).json({ error: pocError.message });
    }
    // ordering pattern
    const orderingFrequencydata = await calculateOrderingPatternsAndFrequency(lead_id);
    const orderingPatterns = orderingFrequencydata.data;

    // Return all the collected data
    return res.status(200).json({
      leadDetails,
      ordersData,
      interactionData,
      callsPlanData,
      pocData,
      orderingPatterns,
    });
  } catch (error) {
    console.error("Error fetching lead data: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getLeadById;

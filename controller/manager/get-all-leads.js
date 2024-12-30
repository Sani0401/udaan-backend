import supabase from "../../config/supabase-config.js";

const getAllLeads = async (req, res) => {
  try {
    const manager_id = req.userId;
    const { data, error } = await supabase
      .from("lead-details")
      .select()
      .eq("created_by", manager_id);
    if (error) {
      console.log("error getting the lead details: ", error);
      return res.status(400).json({ message: "Leads not fetched", error });
    }
    return res.status(200).json({ message: "Leads fetched sucessfully", data });
  } catch (error) {
    console.log("omething went wrong: ", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export default getAllLeads;

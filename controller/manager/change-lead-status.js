import supabase from "../../config/supabase-config.js";
import stageEnum from "../../Helper/manager/enterprise-stage-enum.js";
const changeStatus = async (req, res) => {
    try {
      const { lead_id, new_status } = req.body;
  
      if (!lead_id || !new_status) {
        return res.status(400).json({ message: "Missing required parameters: lead_id or new_status" });
      }
  
      const { error } = await supabase
        .from("lead-details")
        .update({ status: stageEnum[new_status] })
        .match({ id: lead_id }); 
  
      if (error) {
        console.log("Error updating status: ", error);
        return res.status(400).json({ message: "Error updating the status", error });
      }
 
      return res.status(200).json({ message: "Status of lead updated" });
    } catch (error) {
      console.log("Something went wrong: ", error);
      return res.status(500).json({ message: "Internal server error", error });
    }
  };

  export default changeStatus;
  

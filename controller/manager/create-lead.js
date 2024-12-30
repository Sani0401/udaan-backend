import supabase from "../../config/supabase-config.js";
import interactionEnum from "../../Helper/manager/interaction-types-enum.js";

const createLead = async (req, res) => {
  try {
    const { name, address, status, state, country, owner_name } = req.body;

    // Insert lead into the "lead-details" table
    const { data: leadData, error: leadError } = await supabase
      .from("lead-details")
      .insert({
        name,
        address,
        status,
        created_by: req.userId,
        state,
        country,
        owner_name,
      })
      .select("id")
      .single();

    if (leadError) {
      console.error("Error creating lead:", leadError);
      return res.status(400).json({
        success: false,
        message: "Lead creation failed, please try again",
      });
    }

    // Insert interaction into the "interaction-details" table
    const { error: interactionError } = await supabase
      .from("interaction-details")
      .insert({
        lead_id: leadData.id,
        interaction_type: interactionEnum.demoCallDone,
        interaction_details:
          "Demo call done with lead, created lead account",
        account_manager_id: req.userId,
      });

    if (interactionError) {
      console.error("Error creating interaction record:", interactionError);
      return res.status(400).json({
        success: false,
        message: "Lead created but interaction record failed",
        leadID: leadData?.id,
      });
    }

    // Successful creation
    return res.status(200).json({
      success: true,
      message: "Lead created successfully",
      leadID: leadData?.id,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, server error",
    });
  }
};

export default createLead;


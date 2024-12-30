import supabase from "../../config/supabase-config.js";
import interactionEnum from "../../Helper/manager/interaction-types-enum.js";

const updateInteraction = async (req, res) => {
  try {
    const { lead_id, interaction_type, interaction_details } = req.body;

    const mappedInteractionType = interactionEnum[interaction_type];

    if (!mappedInteractionType) {
      return res.status(400).json({
        message: `Invalid interaction type: ${interaction_type}`,
      });
    }

    const { data, error } = await supabase.from("interaction-details").insert({
      lead_id,
      interaction_details,
      interaction_type: mappedInteractionType,
      account_manager_id: req.userId,
    });

    if (error) {
      return res
        .status(400)
        .json({ message: "Interaction not registered", error });
    }

    if (interaction_type === "scheduledCall") {
      const { error: updateError } = await supabase
        .from("call-plans")
        .update({ last_call_date: new Date() })
        .eq("lead_id", lead_id);

      if (updateError) {
        console.log("Last call date not updated:", updateError);
        return res.status(400).json({
          message: "Last call date not updated in call plans",
          error: updateError,
        });
      }
    }

    return res.status(200).json({
      message: "Interaction registered",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

export default updateInteraction;

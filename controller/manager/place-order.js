import supabase from "../../config/supabase-config.js";
import interactionEnum from "../../Helper/manager/interaction-types-enum.js";
const placeOrder = async (req, res) => {
  try {
    const { lead_id, product, amount } = req.body;
    const { data, error } = await supabase.from("order-details").insert({
      lead_id: lead_id,
      account_manager_id: req.userId,
      product: product,
      amount: amount,
    });
    if (error) {
      console.log("Error placing order: ", error);
      return res.status(400).json({ message: "Error placing order", error });
    }

    const { interactionData, interactionError } = await supabase
      .from("interaction-details")
      .insert({
        lead_id: lead_id,
        interaction_type: interactionEnum.purchase,
        interaction_details: `Lead purchased ${product} worth ${amount}`,
        account_manager_id: req.userId
      });
    if (interactionError) {
      console.log("Error adding the interation:", interactionError);
      return res
        .status(400)
        .json({ message: "Order Interaction not created", error });
    }
    return res.status(200).json({ message: "Order placed sucessfully" });
  } catch (error) {
    console.log("Something went wrong");
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export default placeOrder;

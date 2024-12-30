import supabase from "../../config/supabase-config.js";

const addLeadPOC = async (req, res) => {
  try {
    const { name, role, phone, email, lead_id } = req.body;

    if (!name || !role || !phone || !email || !lead_id) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const { data, error } = await supabase
      .from("user-details")
      .insert({
        name,
        role,
        phone,
        email,
        lead_id,
      });

    if (error) {
      console.error("Error adding POC: ", error);
      return res.status(400).json({ message: "POC not added, please try again" });
    }

    return res.status(200).json({ message: "POC added successfully", addedPOC: data });
  } catch (error) {
    console.error("Error in addLeadPOC: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default addLeadPOC;

import supabase from "../../config/supabase-config.js";

const setCallFrequency = async (req, res) => {
  try {
    const { lead_id, frequency_in_days, last_call_date } = req.body;

    // Convert the date to timestamp with time zone
    const formattedDate = new Date(last_call_date).toISOString();

    // Convert frequency_in_days to a number
    const callFrequency = parseInt(frequency_in_days);

    const { data, error } = await supabase
      .from("call-plans")
      .upsert({ 
        lead_id, 
        call_frequency_in_days: callFrequency, 
        last_call_date: formattedDate 
      });

    if (error) {
      return res.status(400).json({ 
        message: "Failed to set call frequency", 
        error 
      });
    }

    return res.status(200).json({ 
      message: "Call frequency set successfully", 
      data 
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Something went wrong", 
      error 
    });
  }
};

export default setCallFrequency;


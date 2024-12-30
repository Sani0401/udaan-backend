import express from "express";
import jwt from "jsonwebtoken";
import passwordCheck from "../../Helper/Admin/password-check.js";
import supabase from "../../config/supabase-config.js";

const loginAccountManager = async (req, res) => {
  try {
    const { email, password } = req.body;
    const secretKey = process.env.secret_key;
    const { data, error } = await supabase
      .from("account-manager-details")
      .select("id, email, name, password")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await passwordCheck(password, data.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: data.id, email: data.email }, secretKey, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "Login successful",
      token: token,
      accountManager: {
        name: data.name,
        email: data.email,
      },
    });
  } catch (error) {
    console.error("Error in loginAccountManager:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default loginAccountManager;

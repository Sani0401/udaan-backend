import express from "express";
import bcrypt from "bcrypt"; // Import bcrypt
import supabase from "../../config/supabase-config.js";
import encryptPassword from "../../Helper/Admin/encrypt-password.js";
const createAccountManager = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    const hashedPassword = await encryptPassword(password);
    console.log("This is the hashed password: ", hashedPassword);
    
    const { data, error } = await supabase
      .from("account-manager-details")
      .insert({
        email: email,
        name: name,
        password: hashedPassword,
        role: "account-manager",
      });

    if (error) {
      console.error(error);
      return res.status(400).send("Error creating account manager");
    }

    res.status(201).send("Account manager created successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default createAccountManager;

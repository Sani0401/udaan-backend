import bcrypt from "bcrypt";

const passwordCheck = async (actualPassword, hashedPassword) => {
  try {
   
    const isPasswordValid = await bcrypt.compare(actualPassword, hashedPassword);
    return isPasswordValid;
  } catch (error) {
    console.error("Error in password check:", error);
    throw error;
  }
};

export default passwordCheck;

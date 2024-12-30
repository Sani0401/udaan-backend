import bcrypt from "bcrypt"; 

const encryptPassword=async(actualPassword)=>{
  const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(actualPassword, saltRounds);
    return hashedPassword
}
export default encryptPassword;
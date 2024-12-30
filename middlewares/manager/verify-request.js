import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Access denied, no token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(403).json({ message: "Access denied, token missing" });
    }

    const decoded = jwt.verify(token, process.env.secret_key); 

    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;

import { getuser } from "../config/jwt.js";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. Token missing" });
  }

  const token = authHeader.split(" ")[1];

  const user = getuser(token);

  if (!user) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = user; // { id, email }
  next();
};

export const protect = authMiddleware;
export default authMiddleware;

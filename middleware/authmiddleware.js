import jwt from 'jsonwebtoken';
import User from "../models/user.js";

// Middleware to verify any authenticated user
export async function verifyUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

// Middleware to verify admin users only
export async function verifyAdmin(req, res, next) {
  try {
    await verifyUser(req, res, async () => {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admins only' });
      }
      next();
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Authorization error' });
  }
}

// Optional: Middleware to verify employee users only
export async function verifyEmployee(req, res, next) {
  try {
    await verifyUser(req, res, async () => {
      if (req.user.role !== 'employee') {
        return res.status(403).json({ success: false, message: 'Employees only' });
      }
      next();
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Authorization error' });
  }
}

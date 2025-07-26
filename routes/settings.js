import express from 'express';
import { verifyUser, verifyAdmin } from '../middleware/authmiddleware.js';
import User from '../models/user.js';

const router = express.Router();

// Get current user's settings (requires login)
router.get('/', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Fetched user settings',
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

// Update user's own settings (requires login)
router.put('/', verifyUser, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'User settings updated',
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error });
  }
});

// Admin-only: View all users' settings (for frontend calling /api/admin/settings)
router.get('/admin/settings', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      message: 'Fetched all user settings (admin only)',
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

export default router;

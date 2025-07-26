import express from 'express';
import {
  getUserSettings,
  updateUserSettings,
  getAllSettings
} from '../controllers/settingscontrollers.js'; // ✅ fixed

import { verifyUser, verifyAdmin } from '../middleware/authmiddleware.js';

const router = express.Router();

// ✅ For logged-in user (GET & PUT)
router.get('/settings', verifyUser, getUserSettings);
router.put('/settings', verifyUser, updateUserSettings);

// ✅ For admin - get all users’ settings
router.get('/settings/all', verifyAdmin, getAllSettings);

export default router;

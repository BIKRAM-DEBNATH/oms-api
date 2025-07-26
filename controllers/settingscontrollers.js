import Settings from "../models/settings.js";

// GET settings for logged-in user
export const getSettings = async (req, res) => {
  try {
    const settingsDoc = await Settings.findOne({ adminId: req.user.id });
    const settings = settingsDoc ? settingsDoc.settings : {};
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    console.error("Error fetching settings:", err.message);
    res.status(500).json({ success: false, message: "Error fetching settings" });
  }
};

// PUT or update settings for logged-in user
export const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ success: false, message: "Invalid settings data" });
    }

    const updatedDoc = await Settings.findOneAndUpdate(
      { adminId: req.user.id },
      { settings },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: updatedDoc.settings });
  } catch (err) {
    console.error("Failed to update settings:", err.message);
    res.status(500).json({ success: false, message: "Failed to update settings" });
  }
};

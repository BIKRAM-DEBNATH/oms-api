import User from "../models/user.js";

// ✅ GET: Logged-in user's settings
export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.settings || {});
  } catch (error) {
    console.error("Error fetching user settings:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ PUT: Update logged-in user's settings
export const updateUserSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.settings = settings;
    await user.save();

    res.status(200).json({ message: "Settings updated successfully", settings: user.settings });
  } catch (error) {
    console.error("Error updating user settings:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET: Admin view - get all user settings
export const getAllSettings = async (req, res) => {
  try {
    const users = await User.find().select("name email settings");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all settings:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

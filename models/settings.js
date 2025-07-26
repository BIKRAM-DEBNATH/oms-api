import mongoose from "mongoose"

const settingsSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  settings: {
    type: Object,
    required: true
  }
}, { timestamps: true })

export default mongoose.model("Settings", settingsSchema)

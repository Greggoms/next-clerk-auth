import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    authId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String },
    role: { type: String, required: true },
    // pto: { type: mongoose.Schema.Types.ObjectId, ref: "Pto" },
    onboarded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

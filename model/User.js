import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  accountBalance: {
    type: Number,
    required: false,
    default: 0,
  },
});

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
      unique: false,
    },
    paid: {
      type: Boolean,
      default: False,
    },
    accounts: {
      type: [AccountSchema],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },

    // Reference to Project collection
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

    // Array of Team member IDs
    assignedMembers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true }
    ],

    // Enum for task status
    status: {
      type: String,
      enum: ["to-do", "in-progress", "done", "cancelled"],
      default: "to-do"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);

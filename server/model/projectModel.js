const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    teamMember: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true }
    ]
});

module.exports = mongoose.model('Project', projectSchema);

const mongoose = require("mongoose");

// --------------------------------------------------------------------------------------------------- //
// Create Schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    roles: {
        type: [String],
        required: true
    }
}, { timestamps: true });

// --------------------------------------------------------------------------------------------------- //
// Exporting it Publicly

module.exports = mongoose.model("User", userSchema);
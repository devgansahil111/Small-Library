const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

// ---------------------------------------------------------------------------------------------- //
// Create Schema

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    ISBN: {
        type: Number,
        required: true
    },
    category: {
        type: [String]
    },
    userId: {
        type: ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

// ----------------------------------------------------------------------------------------------- //
// Exporting it Publicly

module.exports = mongoose.model("Books", bookSchema);
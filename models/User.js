const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    about: { type: String, default: '' },
    location: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, default: null },
    profileImage: { type: String, default: "" },
    eventsAttended: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] },
    ],
    eventsCreated: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] },
    ],
    eventsAttending: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] },
    ],
    otp: { 
        code: { type: String }, 
        expiresAt: { type: Date } 
    },
});

module.exports = mongoose.model("User", UserSchema);

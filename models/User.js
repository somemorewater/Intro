const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    phone: { type: String },
    location: { type: String },
    bio: { type: String },
    profilePicture: { type: String }, // URL or path to the profile picture
    coverPhoto: { type: String }, // URL or path to the cover photo
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

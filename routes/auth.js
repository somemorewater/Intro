const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware'); // Import the verifyToken middleware

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

// Signup route
router.post('/signup', upload.fields([{ name: 'profilePicture' }, { name: 'coverPhoto' }]), async (req, res) => {
    const { fullName, username, email, password, dateOfBirth, phone, location, bio } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Store file paths
        const profilePicturePath = req.files.profilePicture[0].path;
        const coverPhotoPath = req.files.coverPhoto[0].path;

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword,
            dateOfBirth,
            phone,
            location,
            bio,
            profilePicture: profilePicturePath,
            coverPhoto: coverPhotoPath
        });

        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error signing up');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await User.findOne({ $or: [{ username: login }, { email: login }] });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});

// Get User Info Route
router.get('/user', verifyToken, async (req, res) => {
    const userId = req.user.id; // Use the user ID from the token

    try {
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(400).send('Error fetching user info');
    }
});

// Delete Account Route
router.delete('/delete-account', verifyToken, async (req, res) => {
    const userId = req.user.id; // Get user ID from the token

    try {
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error });
    }
});

module.exports = router;

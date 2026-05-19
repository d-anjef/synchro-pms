import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// @desc    Get all users (for assigning tasks etc)
// @route   GET /api/users
// @access  Private
export const getAllUsers = async (req, res, next) => {
  try {
    const { search, role } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;

    const users = await User.find(query)
      .select('name email avatar role jobTitle isOnline lastSeen')
      .sort({ name: 1 })
      .limit(100);

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('projects', 'name icon color')
      .populate('teams', 'name icon');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'jobTitle', 'bio', 'phone', 'location', 'preferences'];
    const updates = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload / Update avatar
// @route   POST /api/users/avatar
// @access  Private
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);

    // Delete old avatar from cloudinary
    if (user.avatar?.publicId) {
      try { await cloudinary.uploader.destroy(user.avatar.publicId); } catch (_) {}
    }

    const result = await uploadToCloudinary(req.file.buffer, 'synchro/avatars');

    user.avatar = { url: result.secure_url, publicId: result.public_id };
    await user.save();

    res.json({ success: true, message: 'Avatar updated', avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite project
// @route   POST /api/users/favorites/:projectId
// @access  Private
export const toggleFavorite = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.favorites.findIndex((p) => String(p) === String(projectId));
    if (index > -1) user.favorites.splice(index, 1);
    else user.favorites.push(projectId);

    await user.save();
    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own account
// @route   DELETE /api/users/profile
// @access  Private
export const deleteOwnAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.isActive = false;
    await user.save();
    res.clearCookie('token');
    res.json({ success: true, message: 'Account deactivated' });
  } catch (error) {
    next(error);
  }
};
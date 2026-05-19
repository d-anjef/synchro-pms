import FileUpload from '../models/FileUpload.js';
import Task from '../models/Task.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const uploadToCloudinary = (buffer, folder, resourceType = 'auto') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// @desc    Upload file
// @route   POST /api/files/upload
// @access  Private
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { task, project } = req.body;
    const folder = `synchro/${project ? 'projects/' + project : 'general'}`;

    const result = await uploadToCloudinary(req.file.buffer, folder);

    const file = await FileUpload.create({
      name: result.original_filename || req.file.originalname,
      originalName: req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      type: req.file.mimetype,
      format: result.format,
      size: req.file.size,
      uploadedBy: req.user._id,
      task: task || undefined,
      project: project || undefined,
    });

    if (task) {
      await Task.findByIdAndUpdate(task, { $push: { attachments: file._id } });
    }

    res.status(201).json({ success: true, file });
  } catch (error) {
    next(error);
  }
};

// @desc    Get files for task / project
// @route   GET /api/files
// @access  Private
export const getFiles = async (req, res, next) => {
  try {
    const { task, project } = req.query;
    const query = {};
    if (task) query.task = task;
    if (project) query.project = project;

    const files = await FileUpload.find(query)
      .populate('uploadedBy', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: files.length, files });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
export const deleteFile = async (req, res, next) => {
  try {
    const file = await FileUpload.findById(req.params.id);
    if (!file) return res.status(404).json({ success: false, message: 'File not found' });

    if (
      String(file.uploadedBy) !== String(req.user._id) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    try { await cloudinary.uploader.destroy(file.publicId); } catch (_) {}

    if (file.task) {
      await Task.findByIdAndUpdate(file.task, { $pull: { attachments: file._id } });
    }

    await file.deleteOne();
    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    next(error);
  }
};
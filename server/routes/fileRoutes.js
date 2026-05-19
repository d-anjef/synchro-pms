import express from 'express';
import { uploadFile, getFiles, deleteFile } from '../controllers/fileController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { requireFeature } from '../middleware/planMiddleware.js';

const router = express.Router();
router.use(protect);

router.post('/upload', requireFeature('fileUploads'), upload.single('file'), uploadFile);
router.get('/', getFiles);
router.delete('/:id', deleteFile);

export default router;
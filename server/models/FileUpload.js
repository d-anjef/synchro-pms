import mongoose from 'mongoose';

const fileUploadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: { type: String, required: true },
    format: { type: String },
    size: { type: Number, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  },
  { timestamps: true }
);

const FileUpload = mongoose.model('FileUpload', fileUploadSchema);
export default FileUpload;
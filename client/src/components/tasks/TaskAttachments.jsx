import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiDownload, FiFile, FiImage, FiX, FiPaperclip } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fileService } from '../../services/fileService';
import { formatFileSize } from '../../utils/formatters';
import './TaskAttachments.css';

const getIconForType = (type) => {
  if (!type) return <FiFile />;
  if (type.startsWith('image/')) return <FiImage />;
  if (type.includes('pdf')) return <FiFile color="#dc2626" />;
  return <FiFile />;
};

const TaskAttachments = ({ task, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const attachments = task.attachments || [];

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('task', task._id);
    formData.append('project', task.project._id || task.project);

    setUploading(true);
    try {
      const res = await fileService.upload(formData);
      toast.success('File uploaded!');
      onUpdate?.({
        ...task,
        attachments: [...attachments, res.file],
      });
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    try {
      await fileService.delete(id);
      onUpdate?.({
        ...task,
        attachments: attachments.filter((a) => a._id !== id),
      });
      toast.success('Deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="task-attachments">
      <div className="task-attachments-header">
        <div className="task-attachments-title">
          <FiPaperclip size={14} />
          <span>Attachment ({attachments.length})</span>
        </div>
        {attachments.length > 0 && (
          <button className="task-attachments-download">Download All</button>
        )}
      </div>

      <div className="task-attachments-list">
        {attachments.map((att, i) => (
          <motion.div
            key={att._id}
            className="task-attachment-item"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="task-attachment-icon">{getIconForType(att.type)}</div>
            <div className="task-attachment-info">
              <div className="task-attachment-name">{att.originalName || att.name}</div>
              <div className="task-attachment-meta">
                {formatFileSize(att.size)} ·{' '}
                <a href={att.url} target="_blank" rel="noreferrer">
                  Download file
                </a>
              </div>
            </div>
            <button
              className="task-attachment-remove"
              onClick={() => handleDelete(att._id)}
              title="Remove"
            >
              <FiX size={14} />
            </button>
          </motion.div>
        ))}

        <button
          className="task-attachment-add"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? '...' : <FiPlus size={18} />}
        </button>
        <input
          type="file"
          ref={fileRef}
          onChange={handleUpload}
          style={{ display: 'none' }}
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip,.txt"
        />
      </div>
    </div>
  );
};

export default TaskAttachments;
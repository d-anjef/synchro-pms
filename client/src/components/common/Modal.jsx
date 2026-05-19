import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, size = 'md', footer }) => {
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose?.();
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`modal-content modal-${size}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="modal-header">
                <h2>{title}</h2>
                <button className="modal-close" onClick={onClose}>
                  <FiX size={20} />
                </button>
              </div>
            )}
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
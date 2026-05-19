import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  variant = 'danger',
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
      {message}
    </p>
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
      <Button variant="outline" onClick={onClose}>Cancel</Button>
      <Button variant={variant} onClick={onConfirm} loading={loading}>
        {confirmText}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
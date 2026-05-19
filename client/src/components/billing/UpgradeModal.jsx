import { useNavigate } from 'react-router-dom';
import { FiZap, FiCheck } from 'react-icons/fi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useSubscription } from '../../hooks/useSubscription';
import './UpgradeModal.css';

const FEATURE_NAMES = {
  fileUploads: 'File Uploads',
  realtime: 'Realtime Collaboration',
  analytics: 'Advanced Analytics',
  adminPanel: 'Admin Panel',
  portfolio: 'Portfolio View',
  goals: 'Goals Tracking',
  reporting: 'Advanced Reporting',
};

const UpgradeModal = () => {
  const { upgradeModal, closeUpgradeModal } = useSubscription();
  const navigate = useNavigate();

  const featureName = upgradeModal.feature ? FEATURE_NAMES[upgradeModal.feature] : 'this feature';

  return (
    <Modal isOpen={upgradeModal.open} onClose={closeUpgradeModal} size="sm">
      <div className="upgrade-modal-content">
        <div className="upgrade-modal-icon">
          <FiZap size={28} fill="currentColor" />
        </div>
        <h2>Upgrade to unlock {featureName}</h2>
        <p>
          You're currently on the Free plan. Upgrade to Pro or Business to access {featureName} and many more powerful features.
        </p>

        <div className="upgrade-modal-perks">
          <div><FiCheck size={14} /> Unlimited projects & tasks</div>
          <div><FiCheck size={14} /> File uploads up to 10GB</div>
          <div><FiCheck size={14} /> Realtime collaboration</div>
          <div><FiCheck size={14} /> Priority support</div>
        </div>

        <div className="upgrade-modal-actions">
          <Button variant="outline" onClick={closeUpgradeModal}>
            Maybe later
          </Button>
          <Button onClick={() => { closeUpgradeModal(); navigate('/billing'); }}>
            View Plans
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpgradeModal;
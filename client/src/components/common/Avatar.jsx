import { getInitials, getAvatarColor } from '../../utils/helpers';
import './Avatar.css';

const Avatar = ({
  src,
  name = '',
  size = 'md',
  status,
  onClick,
  className = '',
}) => {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  return (
    <div
      className={`avatar avatar-${size} ${onClick ? 'avatar-clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {src ? (
        <img src={src} alt={name} />
      ) : (
        <div className="avatar-fallback" style={{ background: bgColor }}>
          {initials || '?'}
        </div>
      )}
      {status && <span className={`avatar-status status-${status}`} />}
    </div>
  );
};

export default Avatar;
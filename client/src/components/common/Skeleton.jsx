import './Skeleton.css';

const Skeleton = ({ width = '100%', height = 20, radius = 8, className = '' }) => (
  <div
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius: radius }}
  />
);

export default Skeleton;
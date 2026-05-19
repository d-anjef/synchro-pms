import './Loader.css';

const Loader = ({ fullScreen = false, size = 'md' }) => (
  <div className={`loader-wrapper ${fullScreen ? 'fullscreen' : ''}`}>
    <div className={`loader loader-${size}`}></div>
  </div>
);

export default Loader;
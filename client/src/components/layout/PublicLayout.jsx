import { Outlet } from 'react-router-dom';
import PublicNavbar from '../public/PublicNavbar';
import Footer from '../public/Footer';
import './PublicLayout.css';

const PublicLayout = () => (
  <div className="public-layout">
    <PublicNavbar />
    <main className="public-main">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default PublicLayout;
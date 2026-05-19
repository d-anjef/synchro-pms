import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { store } from './redux/store';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import AppRoutes from './routes/AppRoutes';
import UpgradeModal from './components/billing/UpgradeModal';
import './styles/global.css';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <SubscriptionProvider>
              <AppRoutes />
              <UpgradeModal />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3500,
                  style: {
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    boxShadow: 'var(--shadow-lg)',
                  },
                }}
              />
            </SubscriptionProvider>
          </AuthProvider>
        </BrowserRouter>
        <Analytics />
        <SpeedInsights/>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
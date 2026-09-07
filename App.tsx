
import React from 'react';
import { HashRouter } from 'react-router-dom';
import Layout from './components/Layout';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './app/routes';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <HashRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </HashRouter>
    </NotificationProvider>
  );
};

export default App;
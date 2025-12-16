import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Quotations from './pages/Quotations';
import Receipts from './pages/Receipts';
import Inventory from './pages/Inventory';
import Leads from './pages/Leads';
import Shop from './pages/Shop';
import { AppProvider } from './store.tsx';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/quotations" element={<Quotations />} />
            <Route path="/receipts" element={<Receipts />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/shop" element={<Shop />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
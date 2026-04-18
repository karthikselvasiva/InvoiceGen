import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import InvoicesList from './pages/Invoices/InvoicesList';
import InvoiceBuilder from './pages/Invoices/InvoiceBuilder';
import ClientsList from './pages/Clients/ClientsList';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<InvoicesList />} />
          <Route path="/invoices/new" element={<InvoiceBuilder />} />
          <Route path="/invoices/edit/:id" element={<InvoiceBuilder />} />
          <Route path="/clients" element={<ClientsList />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

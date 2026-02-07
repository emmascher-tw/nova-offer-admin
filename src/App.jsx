import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import AppShell from './components/layout/AppShell.jsx';
import OffersListPage from './pages/OffersListPage.jsx';
import OfferCreatePage from './pages/OfferCreatePage.jsx';
import OfferEditPage from './pages/OfferEditPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Navigate to="/offers" replace />} />
          <Route path="/offers" element={<OffersListPage />} />
          <Route path="/offers/new" element={<OfferCreatePage />} />
          <Route path="/offers/:id/edit" element={<OfferEditPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

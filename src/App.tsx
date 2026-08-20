import { useEffect, useState, useRef } from 'react';
import { AppProvider, useApp } from '@/hooks/useApp';
import Navbar from '@/components/Navbar';
import Dashboard from '@/pages/Dashboard';
import Trips from '@/pages/Trips';
import TripDetails from '@/pages/TripDetails';
import Destinations from '@/pages/Destinations';
import Itinerary from '@/pages/Itinerary';
import Expenses from '@/pages/Expenses';
import PackingListPage from '@/pages/PackingListPage';
import Settings from '@/pages/Settings';
import CreateTripModal from '@/components/CreateTripModal';
import EditTripModal from '@/components/EditTripModal';
import type { Trip } from '@/types';

export type Page = 'dashboard' | 'trips' | 'tripDetails' | 'destinations' | 'itinerary' | 'expenses' | 'packing' | 'settings';

function AppContent() {
  const { theme, addTrip, updateTrip } = useApp();
  const [page, setPage] = useState<Page>('dashboard');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editTripId, setEditTripId] = useState<string | null>(null);

  // useRef: scroll to top on page change
  const topRef = useRef<HTMLDivElement>(null);

  // useEffect: apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-bs-theme', 'dark');
    } else {
      root.setAttribute('data-bs-theme', 'light');
    }
  }, [theme]);

  const navigate = (p: Page) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const viewTrip = (id: string) => {
    setSelectedTripId(id);
    setPage('tripDetails');
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const editTrip = (id: string) => {
    setEditTripId(id);
  };

  const editingTrip = useApp().trips.find((t) => t.id === editTripId) || null;

  return (
    <div ref={topRef}>
      <Navbar page={page === 'tripDetails' ? 'trips' : page} onNavigate={navigate} />
      <main className="container-fluid px-3 px-lg-4 py-4 tm-main">
        {page === 'dashboard' && <Dashboard onNavigate={navigate} onCreateTrip={() => setShowCreate(true)} onViewTrip={viewTrip} />}
        {page === 'trips' && <Trips onCreateTrip={() => setShowCreate(true)} onViewTrip={viewTrip} onEditTrip={editTrip} />}
        {page === 'tripDetails' && selectedTripId && (
          <TripDetails tripId={selectedTripId} onBack={() => navigate('trips')} onNavigate={navigate} onEditTrip={editTrip} />
        )}
        {page === 'destinations' && <Destinations />}
        {page === 'itinerary' && <Itinerary />}
        {page === 'expenses' && <Expenses />}
        {page === 'packing' && <PackingListPage />}
        {page === 'settings' && <Settings />}
      </main>
      <footer className="tm-footer text-center py-3">
        <span className="small text-muted">TravelMate — Smart Travel Planner. Sample data for demonstration purposes.</span>
      </footer>

      <CreateTripModal show={showCreate} onClose={() => setShowCreate(false)} onSave={(trip: Trip) => addTrip(trip)} />
      <EditTripModal
        show={!!editTripId}
        trip={editingTrip}
        onClose={() => setEditTripId(null)}
        onSave={(id, updates) => updateTrip(id, updates)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

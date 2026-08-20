import { useMemo, useRef, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { PlusLg, Search } from 'react-bootstrap-icons';
import { useApp } from '@/hooks/useApp';
import TripCard from '@/components/TripCard';
import SearchBar from '@/components/SearchBar';
import FilterControls from '@/components/FilterControls';
import ConfirmDialog from '@/components/ConfirmDialog';
import type { SortKey, StatusFilter } from '@/types';
import { getTripStatus } from '@/utils/calculations';

interface TripsProps {
  onCreateTrip: () => void;
  onViewTrip: (id: string) => void;
  onEditTrip: (id: string) => void;
}

export default function Trips({ onCreateTrip, onViewTrip, onEditTrip }: TripsProps) {
  const { trips, deleteTrip } = useApp();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortKey>('startDate');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // useRef: focus search input when Search button clicked
  const handleSearchClick = () => searchRef.current?.focus();

  // useMemo: filtered + sorted trips
  const filteredTrips = useMemo(() => {
    const q = search.toLowerCase().trim();
    const today = new Date().toISOString().split('T')[0];
    let result = trips.filter((t) => {
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.destination.toLowerCase().includes(q) ||
        t.country.toLowerCase().includes(q);
      const matchesStatus = status === 'all' || getTripStatus(t, today) === status;
      return matchesSearch && matchesStatus;
    });
    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'name': return a.name.localeCompare(b.name);
        case 'budget': return b.budget - a.budget;
        case 'destination': return a.destination.localeCompare(b.destination);
        default: return a.startDate.localeCompare(b.startDate);
      }
    });
    return result;
  }, [trips, search, status, sort]);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="mb-1">My Trips</h2>
          <p className="text-muted mb-0">Manage all your travel plans in one place.</p>
        </div>
        <Button variant="primary" onClick={onCreateTrip}>
          <PlusLg className="me-1" /> Create New Trip
        </Button>
      </div>

      <Row className="g-2 mb-4 align-items-center">
        <Col md={7}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by trip name, destination, or country..."
            inputRef={searchRef}
            onSearchClick={handleSearchClick}
          />
        </Col>
        <Col md={5}>
          <FilterControls status={status} onStatusChange={setStatus} sort={sort} onSortChange={setSort} />
        </Col>
      </Row>

      {filteredTrips.length === 0 ? (
        <div className="text-center text-muted py-5">
          <Search style={{ fontSize: '2rem' }} className="mb-2" />
          <p className="mb-0">No trips match your search. Try adjusting your filters.</p>
        </div>
      ) : (
        <Row className="g-3">
          {filteredTrips.map((trip) => (
            <Col key={trip.id} xs={12} md={6} lg={4}>
              <TripCard
                trip={trip}
                onView={onViewTrip}
                onEdit={onEditTrip}
                onDelete={(id) => setDeleteId(id)}
              />
            </Col>
          ))}
        </Row>
      )}

      <ConfirmDialog
        show={!!deleteId}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? This will also remove all related expenses, itinerary items, and packing lists. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => { if (deleteId) deleteTrip(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

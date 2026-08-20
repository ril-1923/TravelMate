import { useMemo, useState, useRef } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import { PlusLg, ListTask } from 'react-bootstrap-icons';
import { useApp } from '@/hooks/useApp';
import ItineraryItemCard, { ItineraryForm } from '@/components/ItineraryItem';
import type { ItineraryItem } from '@/types';
import { formatDate } from '@/utils/dateUtils';

export default function Itinerary() {
  const { trips, itinerary, addItinerary, updateItinerary, deleteItinerary } = useApp();
  const [selectedTripId, setSelectedTripId] = useState<string>(trips[0]?.id || '');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const newActivityRef = useRef<HTMLDivElement>(null);

  // useMemo: filter itinerary for selected trip and group by date
  const groupedItinerary = useMemo(() => {
    const items = itinerary.filter((i) => i.tripId === selectedTripId);
    const groups: Record<string, ItineraryItem[]> = {};
    items.forEach((item) => {
      if (!groups[item.date]) groups[item.date] = [];
      groups[item.date].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [itinerary, selectedTripId]);

  const selectedTrip = trips.find((t) => t.id === selectedTripId);

  const handleSave = (item: ItineraryItem) => {
    if (editingItem) {
      updateItinerary(item.id, item);
    } else {
      addItinerary(item);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="mb-1">Itinerary Planner</h2>
          <p className="text-muted mb-0">Plan your daily activities and schedule.</p>
        </div>
        <Button variant="primary" disabled={!selectedTripId} onClick={() => { setShowForm(true); setEditingItem(null); }}>
          <PlusLg className="me-1" /> Add Activity
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Form.Group>
            <Form.Label>Select Trip</Form.Label>
            <Form.Select value={selectedTripId} onChange={(e) => setSelectedTripId(e.target.value)}>
              <option value="">Choose a trip...</option>
              {trips.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.destination}</option>)}
            </Form.Select>
          </Form.Group>
        </Card.Body>
      </Card>

      {showForm && selectedTrip && (
        <div ref={newActivityRef}>
          <ItineraryForm
            tripId={selectedTrip.id}
            defaultDate={selectedTrip.startDate}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingItem(null); }}
            editing={editingItem}
          />
        </div>
      )}

      {!selectedTripId ? (
        <div className="text-center text-muted py-5">
          <ListTask style={{ fontSize: '2rem' }} className="mb-2" />
          <p className="mb-0">Select a trip to view and manage its itinerary.</p>
        </div>
      ) : groupedItinerary.length === 0 && !showForm ? (
        <Card className="text-center py-4">
          <Card.Body>
            <p className="text-muted mb-2">No activities planned for this trip yet.</p>
            <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
              <PlusLg className="me-1" /> Add First Activity
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="tm-timeline">
          {groupedItinerary.map(([date, items]) => (
            <div key={date} className="mb-4">
              <h6 className="tm-timeline-date">{formatDate(date)}</h6>
              {items.map((item) => (
                <ItineraryItemCard
                  key={item.id}
                  item={item}
                  onToggle={(id) => updateItinerary(id, { completed: !items.find((i) => i.id === id)?.completed })}
                  onEdit={(i) => { setEditingItem(i); setShowForm(true); }}
                  onDelete={deleteItinerary}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

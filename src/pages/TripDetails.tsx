import { useMemo, useRef, useEffect, useState } from 'react';
import { Card, Row, Col, Button, Badge, ProgressBar, ListGroup } from 'react-bootstrap';
import {
  ArrowLeft,
  GeoAltFill,
  Calendar3Fill,
  PeopleFill,
  Wallet2,
  CashStack,
  ListTask,
  BagCheckFill,
  PencilFill,
  ClockFill,
  CheckCircleFill,
  PlusLg,
} from 'react-bootstrap-icons';
import { useApp } from '@/hooks/useApp';
import Countdown from '@/components/Countdown';
import ItineraryItemCard, { ItineraryForm } from '@/components/ItineraryItem';
import type { ItineraryItem } from '@/types';
import type { Page } from '@/App';
import {
  getTripStatus,
  expensesForTrip,
  itineraryForTrip,
  packingForTrip,
  totalExpenses,
  remainingBudget,
  spendingPct,
  isOverBudget,
  packingProgress,
  averageDailySpending,
} from '@/utils/calculations';
import { formatDateRange, formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/formatters';

interface TripDetailsProps {
  tripId: string;
  onBack: () => void;
  onNavigate: (page: Page) => void;
  onEditTrip: (id: string) => void;
}

export default function TripDetails({ tripId, onBack, onNavigate, onEditTrip }: TripDetailsProps) {
  const { trips, expenses, itinerary, packing, addItinerary, updateItinerary, deleteItinerary, togglePacking } = useApp();
  const trip = trips.find((t) => t.id === tripId);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ItineraryItem | null>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const newActivityRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    if (!trip) return null;
    const tripExpenses = expensesForTrip(expenses, trip.id);
    const tripItinerary = itineraryForTrip(itinerary, trip.id);
    const tripPacking = packingForTrip(packing, trip.id);
    const spent = totalExpenses(tripExpenses);
    const remaining = remainingBudget(trip.budget, spent);
    const pct = spendingPct(trip.budget, spent);
    const over = isOverBudget(trip.budget, spent);
    const packPct = packingProgress(tripPacking);
    const avgDaily = averageDailySpending(expenses, trip);
    return { tripExpenses, tripItinerary, tripPacking, spent, remaining, pct, over, packPct, avgDaily };
  }, [trip, expenses, itinerary, packing]);

  // useRef: scroll to newly added activities
  useEffect(() => {
    if (showForm && newActivityRef.current) {
      newActivityRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showForm]);

  if (!trip || !stats) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Trip not found.</p>
        <Button variant="primary" onClick={onBack}>Back to Trips</Button>
      </div>
    );
  }

  const status = getTripStatus(trip);
  const statusVariant: Record<string, string> = { upcoming: 'info', ongoing: 'success', completed: 'secondary' };

  // Group itinerary by date
  const groupedItinerary = useMemo(() => {
    const groups: Record<string, ItineraryItem[]> = {};
    stats.tripItinerary.forEach((item) => {
      if (!groups[item.date]) groups[item.date] = [];
      groups[item.date].push(item);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [stats.tripItinerary]);

  const handleSaveItinerary = (item: ItineraryItem) => {
    if (editingItem) {
      updateItinerary(item.id, item);
    } else {
      addItinerary(item);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const scrollToItinerary = () => {
    itineraryRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3">
        <Button variant="outline-secondary" size="sm" onClick={onBack}>
          <ArrowLeft className="me-1" /> Back
        </Button>
        <Button variant="outline-primary" size="sm" onClick={() => onEditTrip(trip.id)}>
          <PencilFill className="me-1" /> Edit Trip
        </Button>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-2">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h2 className="mb-0">{trip.name}</h2>
            <Badge bg={statusVariant[status]} className="text-capitalize">{status}</Badge>
          </div>
          <p className="text-muted mb-0">
            <GeoAltFill className="me-1" />{trip.destination}, {trip.country}
          </p>
        </div>
        {status === 'upcoming' && <Countdown targetDate={trip.startDate} />}
      </div>

      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <Card className="tm-stat-mini h-100">
            <Card.Body className="text-center">
              <Calendar3Fill className="text-primary mb-1" />
              <div className="small text-muted">Dates</div>
              <div className="small fw-semibold">{formatDateRange(trip.startDate, trip.endDate)}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="tm-stat-mini h-100">
            <Card.Body className="text-center">
              <PeopleFill className="text-info mb-1" />
              <div className="small text-muted">Travelers</div>
              <div className="small fw-semibold">{trip.travelers} ({trip.travelType})</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="tm-stat-mini h-100">
            <Card.Body className="text-center">
              <Wallet2 className="text-success mb-1" />
              <div className="small text-muted">Budget</div>
              <div className="small fw-semibold">{formatCurrency(trip.budget)}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="tm-stat-mini h-100">
            <Card.Body className="text-center">
              <CashStack className={`${stats.over ? 'text-danger' : 'text-warning'} mb-1`} />
              <div className="small text-muted">Spent</div>
              <div className="small fw-semibold">{formatCurrency(stats.spent)}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="fw-semibold">Budget Tracker</Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Spent</span>
                <span className="fw-semibold">{formatCurrency(stats.spent)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Remaining</span>
                <span className={stats.remaining < 0 ? 'text-danger fw-semibold' : 'fw-semibold'}>
                  {formatCurrency(stats.remaining)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Spending</span>
                {stats.over ? <Badge bg="danger">Over Budget</Badge> : <span>{stats.pct}%</span>}
              </div>
              <ProgressBar now={stats.pct} variant={stats.over ? 'danger' : stats.pct > 80 ? 'warning' : 'success'} className="tm-progress" />
              <div className="small text-muted mt-2">Avg daily spending: {formatCurrency(stats.avgDaily)}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header className="fw-semibold">Quick Stats</Card.Header>
            <Card.Body>
              <Row className="g-2 text-center">
                <Col xs={4}>
                  <ListTask className="text-primary mb-1" />
                  <div className="fw-semibold">{stats.tripItinerary.length}</div>
                  <div className="small text-muted">Activities</div>
                </Col>
                <Col xs={4}>
                  <CheckCircleFill className="text-success mb-1" />
                  <div className="fw-semibold">{stats.tripItinerary.filter((i) => i.completed).length}</div>
                  <div className="small text-muted">Completed</div>
                </Col>
                <Col xs={4}>
                  <BagCheckFill className="text-warning mb-1" />
                  <div className="fw-semibold">{stats.packPct}%</div>
                  <div className="small text-muted">Packed</div>
                </Col>
              </Row>
              <ProgressBar now={stats.packPct} variant="info" className="tm-progress mt-3" />
              <Button variant="outline-primary" size="sm" className="w-100 mt-3" onClick={() => onNavigate('packing')}>
                Manage Packing List
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {trip.notes && (
        <Card className="mb-4">
          <Card.Header className="fw-semibold">Trip Notes</Card.Header>
          <Card.Body><p className="mb-0 text-muted">{trip.notes}</p></Card.Body>
        </Card>
      )}

      {/* Itinerary section */}
      <div ref={itineraryRef}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Itinerary</h4>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" size="sm" onClick={scrollToItinerary}>
              <ClockFill className="me-1" /> Scroll Here
            </Button>
            <Button variant="primary" size="sm" onClick={() => { setShowForm(true); setEditingItem(null); }}>
              <PlusLg className="me-1" /> Add Activity
            </Button>
          </div>
        </div>

        {showForm && (
          <div ref={newActivityRef}>
            <ItineraryForm
              tripId={trip.id}
              defaultDate={trip.startDate}
              onSave={handleSaveItinerary}
              onCancel={() => { setShowForm(false); setEditingItem(null); }}
              editing={editingItem}
            />
          </div>
        )}

        {groupedItinerary.length === 0 && !showForm ? (
          <Card className="text-center py-4">
            <Card.Body>
              <p className="text-muted mb-2">No activities planned yet.</p>
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

      {/* Packing checklist preview */}
      <Card className="mt-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="fw-semibold">Packing Checklist</span>
          <Badge bg="light" text="dark">{stats.packPct}%</Badge>
        </Card.Header>
        <Card.Body>
          <ProgressBar now={stats.packPct} variant="info" className="tm-progress mb-3" />
          <ListGroup variant="flush">
            {stats.tripPacking.slice(0, 6).map((item) => (
              <ListGroup.Item key={item.id} className="d-flex align-items-center gap-2 py-2">
                <button className="btn btn-link p-0 tm-check-btn" onClick={() => togglePacking(item.id)}>
                  {item.packed ? <CheckCircleFill className="text-success" /> : <CheckCircleFill className="text-muted opacity-25" />}
                </button>
                <span className={item.packed ? 'text-decoration-line-through text-muted' : ''}>{item.name}</span>
                <Badge bg="light" text="dark" className="ms-auto">{item.category}</Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Button variant="outline-primary" size="sm" className="w-100 mt-2" onClick={() => onNavigate('packing')}>
            Full Packing List
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

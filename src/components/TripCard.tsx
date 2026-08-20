import { Card, Badge, Button, ProgressBar } from 'react-bootstrap';
import {
  GeoAltFill,
  Calendar3Fill,
  PeopleFill,
  Wallet2,
  PencilFill,
  EyeFill,
  TrashFill,
} from 'react-bootstrap-icons';
import type { Trip } from '@/types';
import { useApp } from '@/hooks/useApp';
import { getTripStatus, expensesForTrip, itineraryForTrip, totalExpenses, spendingPct, isOverBudget } from '@/utils/calculations';
import { formatDateRange } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/formatters';

interface TripCardProps {
  trip: Trip;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusVariant: Record<string, string> = {
  upcoming: 'info',
  ongoing: 'success',
  completed: 'secondary',
};

export default function TripCard({ trip, onView, onEdit, onDelete }: TripCardProps) {
  const { expenses, itinerary } = useApp();
  const status = getTripStatus(trip);
  const tripExpenses = expensesForTrip(expenses, trip.id);
  const spent = totalExpenses(tripExpenses);
  const pct = spendingPct(trip.budget, spent);
  const over = isOverBudget(trip.budget, spent);
  const activityCount = itineraryForTrip(itinerary, trip.id).length;

  return (
    <Card className="tm-trip-card h-100">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{trip.name}</h5>
          <Badge bg={statusVariant[status]} className="text-capitalize">{status}</Badge>
        </div>
        <div className="text-muted small mb-3 d-flex align-items-center gap-1">
          <GeoAltFill /> {trip.destination}, {trip.country}
        </div>

        <div className="row g-2 small mb-3">
          <div className="col-6 d-flex align-items-center gap-1">
            <Calendar3Fill className="text-primary" /> {formatDateRange(trip.startDate, trip.endDate)}
          </div>
          <div className="col-6 d-flex align-items-center gap-1">
            <PeopleFill className="text-primary" /> {trip.travelers} travelers
          </div>
          <div className="col-6 d-flex align-items-center gap-1">
            <Wallet2 className="text-primary" /> {formatCurrency(trip.budget)}
          </div>
          <div className="col-6 d-flex align-items-center gap-1 text-muted">
            {activityCount} activities
          </div>
        </div>

        <div className="mt-auto">
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-muted">Spent {formatCurrency(spent)}</span>
            {over ? <Badge bg="danger">Over Budget</Badge> : <span className="text-muted">{pct}%</span>}
          </div>
          <ProgressBar now={pct} variant={over ? 'danger' : pct > 80 ? 'warning' : 'success'} className="tm-progress" />
        </div>
      </Card.Body>
      <Card.Footer className="d-flex gap-2">
        <Button variant="outline-primary" size="sm" className="flex-grow-1" onClick={() => onView(trip.id)}>
          <EyeFill className="me-1" /> View
        </Button>
        <Button variant="outline-secondary" size="sm" onClick={() => onEdit(trip.id)}>
          <PencilFill />
        </Button>
        <Button variant="outline-danger" size="sm" onClick={() => onDelete(trip.id)}>
          <TrashFill />
        </Button>
      </Card.Footer>
    </Card>
  );
}

import { useMemo, useRef } from 'react';
import { Button, Row, Col, Card, ProgressBar, Badge } from 'react-bootstrap';
import {
  SuitcaseLgFill,
  CalendarCheckFill,
  CheckCircleFill,
  GeoAltFill,
  Wallet2,
  CashStack,
  PlusLg,
  ArrowRightCircleFill,
} from 'react-bootstrap-icons';
import { useApp } from '@/hooks/useApp';
import DashboardCard from '@/components/DashboardCard';
import Countdown from '@/components/Countdown';
import {
  getTripStatus,
  totalBudget,
  totalExpenses,
  expensesForTrip,
  itineraryForTrip,
  packingForTrip,
  packingProgress,
  spendingPct,
  isOverBudget,
} from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';
import { formatDateRange } from '@/utils/dateUtils';
import type { Page } from '@/App';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  onCreateTrip: () => void;
  onViewTrip: (id: string) => void;
}

export default function Dashboard({ onNavigate, onCreateTrip, onViewTrip }: DashboardProps) {
  const { trips, expenses, itinerary, packing } = useApp();
  const searchRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const statuses = trips.map((t) => getTripStatus(t, today));
    const upcoming = trips.filter((t) => getTripStatus(t, today) === 'upcoming');
    const ongoing = trips.filter((t) => getTripStatus(t, today) === 'ongoing');
    const completed = trips.filter((t) => getTripStatus(t, today) === 'completed');
    const totalPlanned = totalBudget(trips);
    const totalActual = totalExpenses(expenses);
    const nextTrip = upcoming.sort((a, b) => a.startDate.localeCompare(b.startDate))[0] || ongoing[0];
    const destinations = new Set(trips.map((t) => `${t.destination}, ${t.country}`)).size;
    return { statuses, upcoming, ongoing, completed, totalPlanned, totalActual, nextTrip, destinations };
  }, [trips, expenses]);

  const statusCounts = useMemo(() => {
    const counts = { upcoming: 0, ongoing: 0, completed: 0 };
    stats.statuses.forEach((s) => { counts[s]++; });
    return counts;
  }, [stats.statuses]);

  const nextTripStats = useMemo(() => {
    if (!stats.nextTrip) return null;
    const t = stats.nextTrip;
    const spent = totalExpenses(expensesForTrip(expenses, t.id));
    const pct = spendingPct(t.budget, spent);
    const activities = itineraryForTrip(itinerary, t.id).length;
    const packItems = packingForTrip(packing, t.id);
    const packPct = packingProgress(packItems);
    return { spent, pct, activities, packPct, over: isOverBudget(t.budget, spent) };
  }, [stats.nextTrip, expenses, itinerary, packing]);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Welcome back! Here's your travel overview.</p>
        </div>
        <Button variant="primary" onClick={onCreateTrip}>
          <PlusLg className="me-1" /> Create New Trip
        </Button>
      </div>

      <Row className="g-3 mb-4">
        <Col xs={6} md={4} lg={2}>
          <DashboardCard title="Total Trips" value={trips.length} variant="primary" icon={<SuitcaseLgFill />} />
        </Col>
        <Col xs={6} md={4} lg={2}>
          <DashboardCard title="Upcoming" value={stats.upcoming.length} variant="info" icon={<CalendarCheckFill />} />
        </Col>
        <Col xs={6} md={4} lg={2}>
          <DashboardCard title="Completed" value={stats.completed.length} variant="success" icon={<CheckCircleFill />} />
        </Col>
        <Col xs={6} md={4} lg={2}>
          <DashboardCard title="Destinations" value={stats.destinations} variant="warning" icon={<GeoAltFill />} />
        </Col>
        <Col xs={6} md={4} lg={2}>
          <DashboardCard title="Planned" value={formatCurrency(stats.totalPlanned)} variant="primary" icon={<Wallet2 />} />
        </Col>
        <Col xs={6} md={4} lg={2}>
          <DashboardCard title="Spent" value={formatCurrency(stats.totalActual)} variant="danger" icon={<CashStack />} />
        </Col>
      </Row>

      <Row className="g-3">
        <Col lg={stats.nextTrip ? 8 : 12}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Trip Status Overview</span>
              <Button variant="link" size="sm" className="p-0" onClick={() => onNavigate('trips')}>
                View all <ArrowRightCircleFill className="ms-1" />
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Upcoming</span><span>{statusCounts.upcoming} trips</span>
                </div>
                <ProgressBar now={(statusCounts.upcoming / Math.max(trips.length, 1)) * 100} variant="info" className="tm-progress" />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>Ongoing</span><span>{statusCounts.ongoing} trips</span>
                </div>
                <ProgressBar now={(statusCounts.ongoing / Math.max(trips.length, 1)) * 100} variant="success" className="tm-progress" />
              </div>
              <div>
                <div className="d-flex justify-content-between small mb-1">
                  <span>Completed</span><span>{statusCounts.completed} trips</span>
                </div>
                <ProgressBar now={(statusCounts.completed / Math.max(trips.length, 1)) * 100} variant="secondary" className="tm-progress" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {stats.nextTrip && nextTripStats && (
          <Col lg={4}>
            <Card className="h-100 tm-next-trip">
              <Card.Header className="fw-semibold">Next Trip</Card.Header>
              <Card.Body>
                <h5 className="mb-1">{stats.nextTrip.name}</h5>
                <p className="text-muted small mb-2">
                  <GeoAltFill className="me-1" />{stats.nextTrip.destination}, {stats.nextTrip.country}
                </p>
                <p className="small mb-3">{formatDateRange(stats.nextTrip.startDate, stats.nextTrip.endDate)}</p>
                <Countdown targetDate={stats.nextTrip.startDate} />
                <div className="mt-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Budget used</span>
                    {nextTripStats.over ? <Badge bg="danger">Over Budget</Badge> : <span>{nextTripStats.pct}%</span>}
                  </div>
                  <ProgressBar now={nextTripStats.pct} variant={nextTripStats.over ? 'danger' : 'success'} className="tm-progress" />
                </div>
                <Button variant="outline-primary" size="sm" className="w-100 mt-3" onClick={() => onViewTrip(stats.nextTrip!.id)}>
                  View Trip Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {trips.length === 0 && (
        <Card className="text-center py-5 mt-3">
          <Card.Body>
            <SuitcaseLgFill style={{ fontSize: '3rem' }} className="text-muted mb-3" />
            <h5>No trips yet</h5>
            <p className="text-muted">Create your first trip to start planning your adventure.</p>
            <Button variant="primary" onClick={onCreateTrip}><PlusLg className="me-1" /> Create New Trip</Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

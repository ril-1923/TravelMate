import { Card, Badge } from 'react-bootstrap';
import { GeoAltFill, CalendarHeartFill, CashCoin, StarFill } from 'react-bootstrap-icons';
import type { Destination } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface DestinationCardProps {
  destination: Destination;
}

export default function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Card className="tm-destination-card h-100">
      <div className="tm-destination-img-wrap">
        <img src={destination.image} alt={destination.name} loading="lazy" />
        <Badge bg="primary" className="tm-destination-cost">
          {formatCurrency(destination.dailyCost)}/day
        </Badge>
      </div>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title mb-1">{destination.name}</h5>
          <span className="text-muted small d-flex align-items-center gap-1">
            <GeoAltFill /> {destination.country}
          </span>
        </div>
        <p className="text-muted small flex-grow-1">{destination.description}</p>
        <div className="d-flex flex-wrap gap-3 small text-muted mb-2">
          <span className="d-flex align-items-center gap-1">
            <CashCoin className="text-success" /> {formatCurrency(destination.dailyCost)}/day
          </span>
          <span className="d-flex align-items-center gap-1">
            <CalendarHeartFill className="text-primary" /> {destination.bestSeason}
          </span>
        </div>
        <div className="d-flex flex-wrap gap-1">
          {destination.attractions.slice(0, 3).map((a) => (
            <Badge key={a} pill bg="light" text="dark" className="tm-attraction-badge">
              <StarFill className="me-1" style={{ fontSize: '0.6rem' }} /> {a}
            </Badge>
          ))}
          {destination.attractions.length > 3 && (
            <Badge pill bg="light" text="dark" className="tm-attraction-badge">
              +{destination.attractions.length - 3} more
            </Badge>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

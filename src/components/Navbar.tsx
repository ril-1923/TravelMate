import { GeoAltFill } from 'react-bootstrap-icons';
import type { Page } from '@/App';

interface NavbarProps {
  page: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'trips', label: 'My Trips' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'packing', label: 'Packing List' },
  { id: 'settings', label: 'Settings' },
];

export default function Navbar({ page, onNavigate }: NavbarProps) {
  return (
    <nav className="navbar navbar-expand-lg sticky-top tm-navbar">
      <div className="container-fluid px-3 px-lg-4">
        <button
          className="navbar-brand btn btn-link d-flex align-items-center gap-2 p-0 text-decoration-none"
          onClick={() => onNavigate('dashboard')}
        >
          <span className="tm-brand-icon">
            <GeoAltFill />
          </span>
          <span className="tm-brand-text">
            TravelMate <small>Smart Travel Planner</small>
          </span>
        </button>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            {navItems.map((item) => (
              <li className="nav-item" key={item.id}>
                <button
                  className={`nav-link tm-nav-link ${page === item.id ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

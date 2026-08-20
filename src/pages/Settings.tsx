import { useState } from 'react';
import { Card, Button, Alert, Badge } from 'react-bootstrap';
import { ArrowRepeat, SunFill, MoonStarsFill, InfoCircleFill } from 'react-bootstrap-icons';
import { useApp } from '@/hooks/useApp';
import ConfirmDialog from '@/components/ConfirmDialog';
import ThemeToggle from '@/components/ThemeToggle';

export default function Settings() {
  const { theme, setTheme, resetDemoData } = useApp();
  const [showReset, setShowReset] = useState(false);

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Settings</h2>
        <p className="text-muted mb-0">Customize your TravelMate experience.</p>
      </div>

      <Card className="mb-4">
        <Card.Header className="fw-semibold">Appearance</Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="fw-semibold">Theme</div>
              <div className="small text-muted">
                Currently using {theme === 'dark' ? 'dark' : 'light'} mode.
              </div>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <Button
                variant={theme === 'light' ? 'warning' : 'outline-secondary'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                <SunFill className="me-1" /> Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'dark' : 'outline-secondary'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                <MoonStarsFill className="me-1" /> Dark
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header className="fw-semibold">Data Management</Card.Header>
        <Card.Body>
          <Alert variant="warning">
            <InfoCircleFill className="me-2" />
            Resetting demo data will replace all your trips, expenses, itinerary, and packing lists with the original sample data.
          </Alert>
          <Button variant="danger" onClick={() => setShowReset(true)}>
            <ArrowRepeat className="me-1" /> Reset Demo Data
          </Button>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header className="fw-semibold">
          React Hooks Used <Badge bg="primary">4 hooks</Badge>
        </Card.Header>
        <Card.Body>
          <p className="text-muted small mb-3">
            TravelMate demonstrates practical usage of four core React hooks throughout the application.
          </p>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="tm-hook-card">
                <h6><Badge bg="success">useState</Badge></h6>
                <ul className="small text-muted mb-0 ps-3">
                  <li>Trips, expenses, itinerary, packing lists</li>
                  <li>Form values &amp; validation errors</li>
                  <li>Search query &amp; filter selections</li>
                  <li>Modal visibility &amp; current page</li>
                  <li>Theme preference</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tm-hook-card">
                <h6><Badge bg="info">useEffect</Badge></h6>
                <ul className="small text-muted mb-0 ps-3">
                  <li>LocalStorage synchronization on data change</li>
                  <li>Loading persisted data on app start</li>
                  <li>Applying dark/light theme to document</li>
                  <li>Auto-determining trip status by date</li>
                  <li>Countdown timer interval</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tm-hook-card">
                <h6><Badge bg="warning">useRef</Badge></h6>
                <ul className="small text-muted mb-0 ps-3">
                  <li>Auto-focusing trip name input on modal open</li>
                  <li>Focusing search input on button click</li>
                  <li>Scrolling to itinerary section</li>
                  <li>Scrolling to newly added activity form</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tm-hook-card">
                <h6><Badge bg="primary">useMemo</Badge></h6>
                <ul className="small text-muted mb-0 ps-3">
                  <li>Filtering &amp; sorting trips</li>
                  <li>Total budget &amp; expense calculations</li>
                  <li>Remaining budget &amp; spending percentage</li>
                  <li>Expense breakdown by category</li>
                  <li>Packing completion percentage</li>
                  <li>Destination statistics</li>
                </ul>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={showReset}
        title="Reset Demo Data"
        message="This will replace ALL your current data with the original sample data. Your custom trips, expenses, and packing items will be lost. Continue?"
        confirmLabel="Reset Everything"
        variant="danger"
        onConfirm={() => { resetDemoData(); setShowReset(false); }}
        onCancel={() => setShowReset(false)}
      />
    </div>
  );
}

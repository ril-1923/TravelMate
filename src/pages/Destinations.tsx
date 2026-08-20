import { useMemo, useRef, useState } from 'react';
import { Row, Col, Form, Card } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { demoDestinations } from '@/data/demoData';
import DestinationCard from '@/components/DestinationCard';

export default function Destinations() {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('all');
  const [maxBudget, setMaxBudget] = useState(500);
  const searchRef = useRef<HTMLInputElement>(null);

  const countries = useMemo(() => {
    const set = new Set(demoDestinations.map((d) => d.country));
    return ['all', ...Array.from(set).sort()];
  }, []);

  // useMemo: filter destinations by search, country, and budget
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return demoDestinations.filter((d) => {
      const matchesSearch = !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
      const matchesCountry = country === 'all' || d.country === country;
      const matchesBudget = d.dailyCost <= maxBudget;
      return matchesSearch && matchesCountry && matchesBudget;
    });
  }, [search, country, maxBudget]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Destinations</h2>
        <p className="text-muted mb-0">Discover popular travel destinations around the world. Prices are sample estimates.</p>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-2 align-items-end">
            <Col md={5}>
              <Form.Label className="small">Search</Form.Label>
              <div className="input-group">
                <span className="input-group-text bg-transparent border-end-0"><Search /></span>
                <input
                  ref={searchRef}
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search destinations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </Col>
            <Col md={4}>
              <Form.Label className="small">Country</Form.Label>
              <Form.Select value={country} onChange={(e) => setCountry(e.target.value)}>
                {countries.map((c) => (
                  <option key={c} value={c}>{c === 'all' ? 'All Countries' : c}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Label className="small">Max Daily Cost: ${maxBudget}</Form.Label>
              <Form.Range min={50} max={500} step={10} value={maxBudget} onChange={(e) => setMaxBudget(Number(e.target.value))} />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {filtered.length === 0 ? (
        <div className="text-center text-muted py-5">
          <Search style={{ fontSize: '2rem' }} className="mb-2" />
          <p className="mb-0">No destinations match your filters.</p>
        </div>
      ) : (
        <Row className="g-3">
          {filtered.map((d) => (
            <Col key={d.id} xs={12} md={6} lg={4}>
              <DestinationCard destination={d} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

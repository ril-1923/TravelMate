import { useState } from 'react';
import { Card, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { PencilFill, TrashFill, Check2, ClockFill, GeoAltFill } from 'react-bootstrap-icons';
import type { ItineraryItem, ItineraryCategory } from '@/types';
import { formatDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/formatters';

interface ItineraryItemCardProps {
  item: ItineraryItem;
  onToggle: (id: string) => void;
  onEdit: (item: ItineraryItem) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Sightseeing: 'primary',
  Food: 'success',
  Hotel: 'info',
  Shopping: 'danger',
  Adventure: 'warning',
  Transport: 'secondary',
  Other: 'dark',
};

export default function ItineraryItemCard({ item, onToggle, onEdit, onDelete }: ItineraryItemCardProps) {
  return (
    <div className={`tm-timeline-item ${item.completed ? 'completed' : ''}`}>
      <div className="tm-timeline-dot" />
      <Card className="tm-timeline-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <Badge bg={categoryColors[item.category]}>{item.category}</Badge>
                {item.completed && <Badge bg="success"><Check2 /> Done</Badge>}
              </div>
              <h6 className="mb-1">{item.activity}</h6>
              <div className="small text-muted d-flex flex-wrap gap-3">
                <span><ClockFill className="me-1" />{item.time}</span>
                <span><GeoAltFill className="me-1" />{item.location}</span>
                {item.estimatedCost > 0 && <span className="text-success">{formatCurrency(item.estimatedCost)}</span>}
              </div>
              {item.notes && <div className="small text-muted mt-1">{item.notes}</div>}
            </div>
            <div className="d-flex gap-1">
              <Button variant="outline-secondary" size="sm" onClick={() => onToggle(item.id)}>
                <Check2 />
              </Button>
              <Button variant="outline-primary" size="sm" onClick={() => onEdit(item)}>
                <PencilFill />
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => onDelete(item.id)}>
                <TrashFill />
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

interface ItineraryFormProps {
  tripId: string;
  defaultDate?: string;
  onSave: (item: ItineraryItem) => void;
  onCancel: () => void;
  editing?: ItineraryItem | null;
}

const categories: ItineraryCategory[] = ['Sightseeing', 'Food', 'Hotel', 'Shopping', 'Adventure', 'Transport', 'Other'];

export function ItineraryForm({ tripId, defaultDate, onSave, onCancel, editing }: ItineraryFormProps) {
  const [form, setForm] = useState({
    date: editing?.date || defaultDate || '',
    time: editing?.time || '09:00',
    activity: editing?.activity || '',
    location: editing?.location || '',
    category: editing?.category || ('Sightseeing' as ItineraryCategory),
    estimatedCost: editing?.estimatedCost?.toString() || '0',
    notes: editing?.notes || '',
  });
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!form.date) return setError('Date is required');
    if (!form.activity.trim()) return setError('Activity is required');
    setError('');
    onSave({
      id: editing?.id || `i-${Date.now()}`,
      tripId,
      date: form.date,
      time: form.time,
      activity: form.activity.trim(),
      location: form.location,
      category: form.category,
      estimatedCost: Number(form.estimatedCost) || 0,
      notes: form.notes,
      completed: editing?.completed || false,
    });
  };

  return (
    <Card className="mb-3 tm-form-card">
      <Card.Body>
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <div className="row g-2">
          <Form.Group className="col-md-3">
            <Form.Label className="small">Date</Form.Label>
            <Form.Control size="sm" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Form.Group>
          <Form.Group className="col-md-2">
            <Form.Label className="small">Time</Form.Label>
            <Form.Control size="sm" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </Form.Group>
          <Form.Group className="col-md-4">
            <Form.Label className="small">Activity</Form.Label>
            <Form.Control size="sm" value={form.activity} onChange={(e) => setForm({ ...form, activity: e.target.value })} placeholder="e.g. Museum visit" />
          </Form.Group>
          <Form.Group className="col-md-3">
            <Form.Label className="small">Location</Form.Label>
            <Form.Control size="sm" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Downtown" />
          </Form.Group>
          <Form.Group className="col-md-3">
            <Form.Label className="small">Category</Form.Label>
            <Form.Select size="sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ItineraryCategory })}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="col-md-3">
            <Form.Label className="small">Est. Cost</Form.Label>
            <InputGroup size="sm">
              <InputGroup.Text>$</InputGroup.Text>
              <Form.Control type="number" min={0} value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} />
            </InputGroup>
          </Form.Group>
          <Form.Group className="col-md-6">
            <Form.Label className="small">Notes</Form.Label>
            <Form.Control size="sm" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Form.Group>
        </div>
        <div className="d-flex gap-2 mt-2">
          <Button variant="primary" size="sm" onClick={handleSave}>{editing ? 'Update' : 'Add'} Activity</Button>
          <Button variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

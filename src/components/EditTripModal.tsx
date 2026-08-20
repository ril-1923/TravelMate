import { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import type { Trip, TravelType } from '@/types';

interface EditTripModalProps {
  show: boolean;
  trip: Trip | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Trip>) => void;
}

const travelTypes: TravelType[] = ['Solo', 'Family', 'Couple', 'Friends', 'Business'];

export default function EditTripModal({ show, trip, onClose, onSave }: EditTripModalProps) {
  const [form, setForm] = useState<Trip | null>(trip);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm(trip);
    setErrors({});
  }, [trip, show]);

  if (!form) return null;

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Trip name is required';
    if (!form.destination.trim()) e.destination = 'Destination is required';
    if (!form.country.trim()) e.country = 'Country is required';
    if (!form.startDate) e.startDate = 'Start date is required';
    if (!form.endDate) e.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = 'End date must be after start date';
    if (form.travelers < 1) e.travelers = 'At least 1 traveler';
    if (form.budget < 0) e.budget = 'Budget cannot be negative';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !form) return;
    onSave(form.id, {
      name: form.name,
      destination: form.destination,
      country: form.country,
      startDate: form.startDate,
      endDate: form.endDate,
      travelers: Number(form.travelers),
      budget: Number(form.budget),
      travelType: form.travelType,
      notes: form.notes,
    });
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Trip</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Object.keys(errors).length > 0 && (
          <Alert variant="danger">Please fix the highlighted fields.</Alert>
        )}
        <Form>
          <div className="row g-3">
            <Form.Group className="col-md-6">
              <Form.Label>Trip Name</Form.Label>
              <Form.Control
                value={form.name}
                isInvalid={!!errors.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Travel Type</Form.Label>
              <Form.Select
                value={form.travelType}
                onChange={(e) => setForm({ ...form, travelType: e.target.value as TravelType })}
              >
                {travelTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                value={form.destination}
                isInvalid={!!errors.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
              />
              <Form.Control.Feedback type="invalid">{errors.destination}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Country</Form.Label>
              <Form.Control
                value={form.country}
                isInvalid={!!errors.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
              <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-md-4">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                value={form.startDate}
                isInvalid={!!errors.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
              <Form.Control.Feedback type="invalid">{errors.startDate}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-md-4">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={form.endDate}
                isInvalid={!!errors.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
              <Form.Control.Feedback type="invalid">{errors.endDate}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-md-4">
              <Form.Label>Travelers</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={form.travelers}
                isInvalid={!!errors.travelers}
                onChange={(e) => setForm({ ...form, travelers: Number(e.target.value) })}
              />
              <Form.Control.Feedback type="invalid">{errors.travelers}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-md-6">
              <Form.Label>Budget (USD)</Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={50}
                value={form.budget}
                isInvalid={!!errors.budget}
                onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
              />
              <Form.Control.Feedback type="invalid">{errors.budget}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="col-12">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Form.Group>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
}

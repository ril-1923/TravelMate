import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import type { Expense, ExpenseCategory, Trip } from '@/types';

interface ExpenseFormProps {
  trips: Trip[];
  defaultTripId?: string;
  onAdd: (expense: Expense) => void;
}

const categories: ExpenseCategory[] = ['Flights', 'Hotel', 'Food', 'Transport', 'Activities', 'Shopping', 'Other'];

export default function ExpenseForm({ trips, defaultTripId, onAdd }: ExpenseFormProps) {
  const [form, setForm] = useState({
    name: '',
    category: 'Food' as ExpenseCategory,
    amount: '',
    date: '',
    tripId: defaultTripId || trips[0]?.id || '',
    notes: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Expense name is required');
    if (!form.amount || Number(form.amount) <= 0) return setError('Amount must be greater than 0');
    if (!form.date) return setError('Date is required');
    if (!form.tripId) return setError('Please select a trip');
    setError('');
    onAdd({
      id: `e-${Date.now()}`,
      tripId: form.tripId,
      name: form.name.trim(),
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
      notes: form.notes,
    });
    setForm({ ...form, name: '', amount: '', notes: '' });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger" className="py-2">{error}</Alert>}
      <div className="row g-2">
        <Form.Group className="col-md-4">
          <Form.Label className="small">Expense Name</Form.Label>
          <Form.Control size="sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Museum ticket" />
        </Form.Group>
        <Form.Group className="col-md-3">
          <Form.Label className="small">Category</Form.Label>
          <Form.Select size="sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ExpenseCategory })}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group className="col-md-2">
          <Form.Label className="small">Amount</Form.Label>
          <Form.Control size="sm" type="number" min={0} step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </Form.Group>
        <Form.Group className="col-md-3">
          <Form.Label className="small">Date</Form.Label>
          <Form.Control size="sm" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </Form.Group>
        <Form.Group className="col-md-5">
          <Form.Label className="small">Trip</Form.Label>
          <Form.Select size="sm" value={form.tripId} onChange={(e) => setForm({ ...form, tripId: e.target.value })}>
            <option value="">Select trip...</option>
            {trips.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Form.Select>
        </Form.Group>
        <Form.Group className="col-md-5">
          <Form.Label className="small">Notes</Form.Label>
          <Form.Control size="sm" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Form.Group>
        <div className="col-md-2 d-flex align-items-end">
          <Button type="submit" variant="primary" size="sm" className="w-100">Add</Button>
        </div>
      </div>
    </Form>
  );
}

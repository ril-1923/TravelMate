import { Table, Badge, Button } from 'react-bootstrap';
import { TrashFill } from 'react-bootstrap-icons';
import type { Expense, Trip } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { formatDate } from '@/utils/dateUtils';

interface ExpenseTableProps {
  expenses: Expense[];
  trips: Trip[];
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Flights: 'primary',
  Hotel: 'info',
  Food: 'success',
  Transport: 'warning',
  Activities: 'secondary',
  Shopping: 'danger',
  Other: 'dark',
};

export default function ExpenseTable({ expenses, trips, onDelete }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <p className="mb-0">No expenses recorded yet. Add your first expense above.</p>
      </div>
    );
  }

  const tripName = (id: string) => trips.find((t) => t.id === id)?.name || '—';

  return (
    <div className="table-responsive">
      <Table hover className="tm-table align-middle">
        <thead>
          <tr>
            <th>Date</th>
            <th>Expense</th>
            <th>Category</th>
            <th>Trip</th>
            <th className="text-end">Amount</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e.id}>
              <td className="small">{formatDate(e.date)}</td>
              <td>{e.name}{e.notes && <div className="small text-muted">{e.notes}</div>}</td>
              <td><Badge bg={categoryColors[e.category] || 'secondary'}>{e.category}</Badge></td>
              <td className="small">{tripName(e.tripId)}</td>
              <td className="text-end fw-semibold">{formatCurrency(e.amount)}</td>
              <td className="text-end">
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(e.id)}>
                  <TrashFill />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

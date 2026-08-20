import { useMemo, useState } from 'react';
import { Card, Row, Col, ProgressBar, Badge } from 'react-bootstrap';
import { Wallet2, CashStack, CashCoin, GraphUp } from 'react-bootstrap-icons';
import { useApp } from '@/hooks/useApp';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseTable from '@/components/ExpenseTable';
import ConfirmDialog from '@/components/ConfirmDialog';
import {
  totalExpenses,
  expensesByCategory,
  totalBudget,
  remainingBudget,
} from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';

export default function Expenses() {
  const { trips, expenses, addExpense, deleteExpense } = useApp();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // useMemo: expense calculations
  const stats = useMemo(() => {
    const totalSpent = totalExpenses(expenses);
    const totalPlanned = totalBudget(trips);
    const remaining = remainingBudget(totalPlanned, totalSpent);
    const byCategory = expensesByCategory(expenses);
    const pct = totalPlanned > 0 ? Math.min(100, Math.round((totalSpent / totalPlanned) * 100)) : 0;
    return { totalSpent, totalPlanned, remaining, byCategory, pct };
  }, [expenses, trips]);

  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses]);

  const categoryColors: Record<string, string> = {
    Flights: 'primary', Hotel: 'info', Food: 'success',
    Transport: 'warning', Activities: 'secondary', Shopping: 'danger', Other: 'dark',
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Expense Tracker</h2>
        <p className="text-muted mb-0">Track your spending across all trips.</p>
      </div>

      <Row className="g-3 mb-4">
        <Col xs={12} md={3}>
          <Card className="tm-stat-mini h-100">
            <Card.Body className="text-center">
              <Wallet2 className="text-primary mb-1" />
              <div className="small text-muted">Total Budget</div>
              <div className="fw-semibold">{formatCurrency(stats.totalPlanned)}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="tm-stat-mini h-100">
            <Card.Body className="text-center">
              <CashStack className="text-danger mb-1" />
              <div className="small text-muted">Total Spent</div>
              <div className="fw-semibold">{formatCurrency(stats.totalSpent)}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="tm-stat-mini h-100">
            <Card.Body className="text-center">
              <CashCoin className={stats.remaining < 0 ? 'text-danger' : 'text-success'} mb-1 />
              <div className="small text-muted">Remaining</div>
              <div className={`fw-semibold ${stats.remaining < 0 ? 'text-danger' : ''}`}>
                {formatCurrency(stats.remaining)}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="tm-stat-mini h-100">
            <Card.Body className="text-center">
              <GraphUp className="text-warning mb-1" />
              <div className="small text-muted">Budget Used</div>
              <div className="fw-semibold">{stats.pct}%</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Budget Summary */}
      <Card className="mb-4">
        <Card.Header className="fw-semibold">Travel Budget Summary</Card.Header>
        <Card.Body>
          <div className="mb-3">
            <div className="d-flex justify-content-between small mb-1">
              <span>Total Spending</span>
              <span>{formatCurrency(stats.totalSpent)} / {formatCurrency(stats.totalPlanned)}</span>
            </div>
            <ProgressBar
              now={stats.pct}
              variant={stats.pct > 100 ? 'danger' : stats.pct > 80 ? 'warning' : 'success'}
              className="tm-progress"
            />
          </div>
          <Row className="g-2 mt-2">
            {stats.byCategory.map((cat) => (
              <Col xs={6} md={4} lg={3} key={cat.category}>
                <div className="tm-category-bar">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>{cat.category}</span>
                    <span className="text-muted">{formatCurrency(cat.total)}</span>
                  </div>
                  <ProgressBar now={cat.percentage} variant={categoryColors[cat.category] || 'secondary'} className="tm-progress" />
                </div>
              </Col>
            ))}
            {stats.byCategory.length === 0 && (
              <p className="text-muted small mb-0">No expenses recorded yet.</p>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Add Expense */}
      <Card className="mb-4">
        <Card.Header className="fw-semibold">Add Expense</Card.Header>
        <Card.Body>
          <ExpenseForm trips={trips} onAdd={addExpense} />
        </Card.Body>
      </Card>

      {/* Expense Table */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="fw-semibold">All Expenses</span>
          <Badge bg="primary">{expenses.length} total</Badge>
        </Card.Header>
        <Card.Body className="p-0">
          <ExpenseTable expenses={sortedExpenses} trips={trips} onDelete={(id) => setDeleteId(id)} />
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={!!deleteId}
        title="Delete Expense"
        message="Are you sure you want to delete this expense?"
        confirmLabel="Delete"
        onConfirm={() => { if (deleteId) deleteExpense(deleteId); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

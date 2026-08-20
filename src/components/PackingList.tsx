import { useState } from 'react';
import { ListGroup, Form, Button, Badge, ProgressBar } from 'react-bootstrap';
import { PlusLg, TrashFill, Check2, CheckCircleFill, Circle } from 'react-bootstrap-icons';
import type { PackingItem, PackingCategory } from '@/types';
import { useApp } from '@/hooks/useApp';
import { packingProgress } from '@/utils/calculations';

const categories: PackingCategory[] = ['Documents', 'Clothing', 'Electronics', 'Personal'];

export default function PackingList() {
  const { packing, addPacking, togglePacking, deletePacking } = useApp();
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState<PackingCategory>('Documents');

  const progress = packingProgress(packing);

  const handleAdd = () => {
    if (!newItem.trim()) return;
    addPacking({
      id: `p-${Date.now()}`,
      tripId: 'all',
      name: newItem.trim(),
      category: newCategory,
      packed: false,
    });
    setNewItem('');
  };

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="fw-semibold">Packing Progress</span>
            <Badge bg={progress === 100 ? 'success' : 'primary'}>{progress}%</Badge>
          </div>
          <ProgressBar now={progress} variant={progress === 100 ? 'success' : 'primary'} className="tm-progress" />
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-md-6">
              <Form.Label className="small">Add Custom Item</Form.Label>
              <Form.Control
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="e.g. Hiking boots"
              />
            </div>
            <div className="col-md-3">
              <Form.Label className="small">Category</Form.Label>
              <Form.Select value={newCategory} onChange={(e) => setNewCategory(e.target.value as PackingCategory)}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </Form.Select>
            </div>
            <div className="col-md-3">
              <Button variant="primary" className="w-100" onClick={handleAdd}>
                <PlusLg className="me-1" /> Add Item
              </Button>
            </div>
          </div>
        </div>
      </div>

      {categories.map((cat) => {
        const items = packing.filter((p) => p.category === cat);
        if (items.length === 0) return null;
        const packed = items.filter((i) => i.packed).length;
        return (
          <div key={cat} className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span className="fw-semibold">{cat}</span>
              <Badge bg="light" text="dark">{packed}/{items.length}</Badge>
            </div>
            <ListGroup variant="flush">
              {items.map((item) => (
                <ListGroup.Item key={item.id} className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-link p-0 tm-check-btn"
                    onClick={() => togglePacking(item.id)}
                    aria-label={item.packed ? 'Mark unpacked' : 'Mark packed'}
                  >
                    {item.packed ? <CheckCircleFill className="text-success" /> : <Circle className="text-muted" />}
                  </button>
                  <span className={item.packed ? 'text-decoration-line-through text-muted flex-grow-1' : 'flex-grow-1'}>
                    {item.name}
                  </span>
                  <Button variant="outline-danger" size="sm" onClick={() => deletePacking(item.id)}>
                    <TrashFill />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        );
      })}

      {packing.length === 0 && (
        <div className="text-center text-muted py-5">
          <Check2 className="mb-2" style={{ fontSize: '2rem' }} />
          <p className="mb-0">Your packing list is empty. Add items above to get started.</p>
        </div>
      )}
    </div>
  );
}

import PackingListComponent from '@/components/PackingList';

export default function PackingListPage() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-1">Packing List</h2>
        <p className="text-muted mb-0">Make sure you have everything for your trip. Check items off as you pack.</p>
      </div>
      <PackingListComponent />
    </div>
  );
}

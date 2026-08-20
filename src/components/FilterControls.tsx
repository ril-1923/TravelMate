import type { SortKey, StatusFilter } from '@/types';

interface FilterControlsProps {
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
}

export default function FilterControls({ status, onStatusChange, sort, onSortChange }: FilterControlsProps) {
  return (
    <div className="d-flex flex-wrap gap-2 align-items-center">
      <div className="btn-group btn-group-sm tm-filter-group" role="group" aria-label="Status filter">
        {(['all', 'upcoming', 'ongoing', 'completed'] as StatusFilter[]).map((s) => (
          <button
            key={s}
            type="button"
            className={`btn btn-outline-primary text-capitalize ${status === s ? 'active' : ''}`}
            onClick={() => onStatusChange(s)}
          >
            {s}
          </button>
        ))}
      </div>
      <select
        className="form-select form-select-sm tm-sort-select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortKey)}
        aria-label="Sort by"
      >
        <option value="startDate">Sort: Start Date</option>
        <option value="name">Sort: Trip Name</option>
        <option value="budget">Sort: Budget</option>
        <option value="destination">Sort: Destination</option>
      </select>
    </div>
  );
}

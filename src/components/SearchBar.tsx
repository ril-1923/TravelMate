import { Search } from 'react-bootstrap-icons';
import type { ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  onSearchClick?: () => void;
}

export default function SearchBar({ value, onChange, placeholder, inputRef, onSearchClick }: SearchBarProps) {
  return (
    <div className="input-group tm-search">
      <span className="input-group-text bg-transparent border-end-0">
        <Search />
      </span>
      <input
        ref={inputRef}
        type="text"
        className="form-control border-start-0"
        placeholder={placeholder}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
      {onSearchClick && (
        <button className="btn btn-primary" type="button" onClick={onSearchClick}>
          Search
        </button>
      )}
    </div>
  );
}

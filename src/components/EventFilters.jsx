import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const CATEGORIES = ['All', 'Academic', 'Sports', 'Cultural', 'Technical', 'Workshop', 'Seminar', 'Competition', 'Other'];
const STATUSES = ['All', 'upcoming', 'ongoing', 'completed'];

const EventFilters = ({ onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  const update = (updates) => {
    const newFilters = { search, category, status, ...updates };
    // Normalize 'All' to empty string for API
    onFilterChange({
      search: newFilters.search,
      category: newFilters.category === 'All' ? '' : newFilters.category,
      status: newFilters.status === 'All' ? '' : newFilters.status
    });
  };

  const handleSearch = (val) => {
    setSearch(val);
    update({ search: val });
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    update({ category: cat });
  };

  const handleStatus = (s) => {
    setStatus(s);
    update({ status: s });
  };

  const clearAll = () => {
    setSearch(''); setCategory('All'); setStatus('All');
    onFilterChange({ search: '', category: '', status: '' });
  };

  const hasFilters = search || category !== 'All' || status !== 'All';

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Search + Status */}
      <div className="filter-bar">
        <div className="search-input-wrapper" style={{ flex: 1, minWidth: '240px' }}>
          <FiSearch />
          <input
            type="text"
            className="form-input"
            placeholder="Search events by title, venue, organizer..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            id="event-search"
          />
        </div>

        <select
          className="form-input form-select"
          value={status}
          onChange={e => handleStatus(e.target.value)}
          style={{ width: 'auto', minWidth: '130px' }}
          id="event-status-filter"
        >
          {STATUSES.map(s => (
            <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        {hasFilters && (
          <button className="btn btn-ghost btn-sm" onClick={clearAll}>
            <FiX /> Clear
          </button>
        )}
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-chip${category === cat ? ' active' : ''}`}
            onClick={() => handleCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventFilters;

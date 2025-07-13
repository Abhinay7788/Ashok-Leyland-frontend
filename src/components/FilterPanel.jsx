import React from "react";

const FilterPanel = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="row g-3 align-items-end">
      <div className="col-md-2">
        <label>Type</label>
        <select
          className="form-select"
          name="type"
          value={filters.type}
          onChange={handleChange}
        >
          <option value="All">All</option>
          <option value="bus">Bus</option>
          <option value="truck">Truck</option>
        </select>
      </div>
      <div className="col-md-2">
        <label>Min Score</label>
        <input
          type="number"
          className="form-control"
          name="scoreMin"
          value={filters.scoreMin}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-2">
        <label>Max Score</label>
        <input
          type="number"
          className="form-control"
          name="scoreMax"
          value={filters.scoreMax}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-3">
        <label>Start Date</label>
        <input
          type="date"
          className="form-control"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-3">
        <label>End Date</label>
        <input
          type="date"
          className="form-control"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default FilterPanel;
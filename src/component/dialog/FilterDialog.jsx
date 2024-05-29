// FilterDialog.jsx
import React, { useState } from 'react';
import Dialog from "../shared/Dialog";
import Dropdown from "../shared/Dropdown";
import TrashIcon from "../icons/TrashIcon";

const FilterDialog = ({ onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState([]);

  const Operator = [
    { id: 0, selectOp: "=" },
    { id: 1, selectOp: ">" },
    { id: 2, selectOp: "<" },
  ];

  const handleAddFilter = () => {
    setFilters([...filters, { operator: "=", threshold: 5, color: "#ffffff" }]);
  };

  const handleFilterChange = (index, key, value) => {
    const newFilters = [...filters];
    newFilters[index][key] = value;
    setFilters(newFilters);
  };

  const handleRemoveFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <Dialog onCancel={onClose}>
      <div className="flex flex-col gap-10 p-6 bg-white border border-gray-100 border-solid w-96 rounded-primary">
      <span className="text-base font-bold">Filter Warna</span>
        {filters.map((filter, index) => (
          <div key={index} className="flex h-8 gap-2">
            <div>
              <Dropdown
                options={Operator}
                value={filter.operator}
                setValue={(value) => handleFilterChange(index, "operator", value)}
                px='2'
                py='2'
                rounded='lg'
                border='primary'
                justify='center'
              />
            </div>
            <input
              type="text"
              className="flex items-center w-full h-full px-4 border border-solid rounded-lg border-primary placeholder:text-base placeholder:font-medium placeholder:text-gray-400"
              value={filter.threshold}
              onChange={(e) => handleFilterChange(index, "threshold", e.target.value)}
              placeholder="Pilih angka nya saja"
            />
            <input
              type="color"
              className="h-full border border-solid rounded-lg w-11 border-primary"
              value={filter.color}
              onChange={(e) => handleFilterChange(index, "color", e.target.value)}
            />
            <button
              type="button"
              className="flex items-center justify-center w-12 h-full border border-gray-200 border-solid rounded-lg"
              onClick={() => handleRemoveFilter(index)}
            >
              <TrashIcon />
            </button>
          </div>
        ))}
        <button onClick={handleAddFilter} className="flex items-center justify-center w-full h-8 gap-1 text-base font-bold border border-solid rounded-lg border-primary text-primary">
          Tambah
        </button>
        <div className="flex h-12 gap-6">
          <button
            onClick={onClose}
            className="flex items-center justify-center w-full h-full text-base font-bold border border-solid rounded-lg border-primary text-primary"
          >
            Batalkan
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex items-center justify-center w-full h-full text-base font-bold text-white rounded-lg bg-primary"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default FilterDialog;

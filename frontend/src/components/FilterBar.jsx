import React, { useMemo } from 'react';
import { RotateCcw, ChevronDown } from 'lucide-react';

const FilterBar = ({ filters, options, onFilterChange, onReset }) => {
  
  // 1. Define the relationship between Categories and Tags
  // This acts as a filter: "If Category X is selected, only show these tags"
  const categoryTagsMap = {
    "Beauty": ["organic", "skincare", "makeup", "fragrance-free"],
    "Clothing": ["unisex", "cotton", "fashion", "casual", "formal"],
    "Electronics": ["smart"], // Add more if needed
  };

  // 2. Logic to calculate which tags to show
  const visibleTags = useMemo(() => {
    // If no tags loaded from backend yet, return empty
    if (!options.tags || options.tags.length === 0) return [];

    // If a category is selected (e.g., "Beauty")
    if (filters.category) {
      const allowedTags = categoryTagsMap[filters.category];
      if (allowedTags) {
        // Only show tags that are BOTH in the backend list AND in our allowed list
        return options.tags.filter(tag => allowedTags.includes(tag));
      }
    }
    
    // If no category selected, show ALL tags from the backend
    return options.tags;
  }, [filters.category, options.tags]);

  // Static options
  const ageRanges = ["0-18", "19-25", "26-35", "36-45", "46-60", "60+"];
  const dateRanges = ["Last 24 Hours", "Last 7 Days", "Last 30 Days", "This Month"];

  return (
    <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap gap-3 items-center shadow-sm z-10">
      <button 
        onClick={onReset}
        className="p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 rounded-full transition-colors"
        title="Reset Filters"
      >
        <RotateCcw size={16} />
      </button>

      {/* 1. Customer Region (Direct from Backend) */}
      <FilterSelect 
        label="Customer Region" 
        value={filters.region} 
        onChange={(val) => onFilterChange('region', val)}
        options={options.regions || []} 
      />
      
      {/* 2. Gender */}
      <FilterSelect 
        label="Gender" 
        value={filters.gender} 
        onChange={(val) => onFilterChange('gender', val)}
        options={['Male', 'Female']}
      />

      {/* 3. Age Range */}
      <FilterSelect 
        label="Age Range" 
        value={filters.ageRange} 
        onChange={(val) => onFilterChange('ageRange', val)}
        options={ageRanges} 
      />

      {/* 4. Product Category (Direct from Backend) */}
      <FilterSelect 
        label="Product Category" 
        value={filters.category} 
        onChange={(val) => onFilterChange('category', val)}
        options={options.categories || []}
      />

      {/* 5. Tags (SMART FILTER APPLIED HERE) */}
      <FilterSelect 
        label="Tags" 
        value={filters.tags} 
        onChange={(val) => onFilterChange('tags', val)}
        options={visibleTags} // Uses the filtered list based on category
      />

      {/* 6. Payment Method (Direct from Backend) */}
      <FilterSelect 
        label="Payment Method" 
        value={filters.paymentMethod} 
        onChange={(val) => onFilterChange('paymentMethod', val)}
        options={options.paymentMethods || []}
      />

      {/* 7. Date */}
      <FilterSelect 
        label="Date" 
        value={filters.dateRange} 
        onChange={(val) => onFilterChange('dateRange', val)}
        options={dateRanges} 
      />
      
      {/* Sort Dropdown */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
        <select 
          className="text-sm font-medium border-none focus:ring-0 cursor-pointer text-gray-700 bg-transparent hover:text-green-700 outline-none"
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          value={filters.sortBy}
        >
          <option value="name">Customer Name (A-Z)</option>
          <option value="date">Date (Newest)</option>
          <option value="quantity">Quantity (High-Low)</option>
        </select>
      </div>
    </div>
  );
};

const FilterSelect = ({ label, value, onChange, options = [] }) => (
  <div className="relative">
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className={`appearance-none px-4 py-1.5 pr-8 border rounded-md text-xs font-medium focus:outline-none focus:border-gray-400 transition-shadow bg-gray-50 hover:bg-gray-100 cursor-pointer ${
        value ? 'border-green-500 text-green-700 bg-green-50' : 'border-gray-200 text-gray-600'
      }`}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
      <ChevronDown size={12} />
    </div>
  </div>
);

export default FilterBar;
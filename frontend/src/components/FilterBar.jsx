import React, { useMemo } from "react";
import { RotateCcw, ChevronDown } from "lucide-react";

/* ===================== FILTER BAR ===================== */

const FilterBar = ({ filters, options = {}, onFilterChange, onReset }) => {
  const defaults = {
    regions: ["North", "South", "East", "West", "Central"],
    categories: ["Clothing", "Electronics", "Beauty"],
    paymentMethods: ["Credit Card", "Wallet", "UPI", "Cash"],
  };

  const categoryTagsMap = {
    Beauty: ["organic", "skincare", "makeup", "fragrance-free"],
    Clothing: ["unisex", "cotton", "fashion", "casual", "formal"],
    Electronics: ["smart"],
  };

  const visibleTags = useMemo(() => {
    if (!filters.category) return [];
    return categoryTagsMap[filters.category] || [];
  }, [filters.category]);

  return (
    <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap gap-3 items-center shadow-sm">

      {/* Reset */}
      <button
        onClick={onReset}
        className="p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 rounded-full"
        title="Reset Filters"
      >
        <RotateCcw size={16} />
      </button>

      {/* Region */}
      <FilterSelect
        label="Customer Region"
        value={filters.region}
        options={options.regions || defaults.regions}
        onChange={(v) => onFilterChange("region", v)}
      />

      {/* Gender */}
      <FilterSelect
        label="Gender"
        value={filters.gender}
        options={["Male", "Female"]}
        onChange={(v) => onFilterChange("gender", v)}
      />

      {/* Age Range */}
      <RangeInput
        label="Age"
        start={filters.ageFrom}
        end={filters.ageTo}
        onChange={(from, to) => {
          onFilterChange("ageFrom", from);
          onFilterChange("ageTo", to);
        }}
      />

      {/* Category */}
      <FilterSelect
        label="Product Category"
        value={filters.category}
        options={options.categories || defaults.categories}
        onChange={(v) => {
          onFilterChange("category", v);
          onFilterChange("tags", "");
        }}
      />

      {/* Tags (Disabled until category selected) */}
      <FilterSelect
        label="Tags"
        value={filters.tags}
        options={visibleTags}
        disabled={!filters.category}
        onChange={(v) => onFilterChange("tags", v)}
      />

      {/* Payment Method */}
      <FilterSelect
        label="Payment Method"
        value={filters.paymentMethod}
        options={options.paymentMethods || defaults.paymentMethods}
        onChange={(v) => onFilterChange("paymentMethod", v)}
      />

      {/* Date Range */}
      <DateRangeInput
        start={filters.startDate}
        end={filters.endDate}
        onChange={(from, to) => {
          onFilterChange("startDate", from);
          onFilterChange("endDate", to);
        }}
      />
    </div>
  );
};

/* ===================== SELECT ===================== */

const FilterSelect = ({
  label,
  value,
  options = [],
  onChange,
  disabled = false,
}) => (
  <div className="relative">
    <select
      value={value || ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`appearance-none px-4 py-1.5 pr-8 border rounded-md text-xs font-medium focus:outline-none transition
        ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : value
            ? "border-green-500 bg-green-50 text-green-700"
            : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      {/* NON-SELECTABLE HEADING */}
      <option value="" disabled hidden>
        {label}
      </option>

      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>

    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
      <ChevronDown size={12} />
    </div>
  </div>
);

/* ===================== AGE RANGE ===================== */

const RangeInput = ({ label, start, end, onChange }) => (
  <div className="flex items-center gap-1 text-xs">
    <span className="text-gray-500">{label}</span>
    <input
      type="number"
      placeholder="From"
      value={start || ""}
      onChange={(e) => onChange(e.target.value, end)}
      className="w-16 px-2 py-1 border rounded focus:outline-none"
    />
    <span>-</span>
    <input
      type="number"
      placeholder="To"
      value={end || ""}
      onChange={(e) => onChange(start, e.target.value)}
      className="w-16 px-2 py-1 border rounded focus:outline-none"
    />
  </div>
);

/* ===================== DATE RANGE ===================== */

const DateRangeInput = ({ start, end, onChange }) => (
  <div className="flex items-center gap-1 text-xs">
    <input
      type="date"
      value={start || ""}
      onChange={(e) => onChange(e.target.value, end)}
      className="px-2 py-1 border rounded focus:outline-none"
    />
    <span>-</span>
    <input
      type="date"
      value={end || ""}
      onChange={(e) => onChange(start, e.target.value)}
      className="px-2 py-1 border rounded focus:outline-none"
    />
  </div>
);

export default FilterBar;

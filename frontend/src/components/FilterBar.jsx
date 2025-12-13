import React, { useMemo } from "react";
import { RotateCcw, ChevronDown } from "lucide-react";

/* ===================== FILTER BAR ===================== */

const FilterBar = ({ filters, options = {}, onFilterChange, onReset }) => {
  const defaults = {
    regions: ["North", "South", "East", "West", "Central"],
    categories: ["Clothing", "Electronics", "Beauty"],
    paymentMethods: ["Credit Card", "Wallet", "UPI", "Cash"],
  };

  const ageRanges = ["0-18", "19-25", "26-35", "36-45", "46-60", "60+"];

  // FIX: Ensure these match what your backend expects, or handle the conversion in the parent component
  const dateRanges = [
    "Today",
    "Last 7 Days",
    "Last 30 Days",
    "This Month",
    "Last Month",
  ];

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
      <FilterSelect
        label="Age Range"
        value={filters.ageRange}
        options={ageRanges}
        onChange={(v) => onFilterChange("ageRange", v)}
      />

      {/* Category */}
      <FilterSelect
        label="Product Category"
        value={filters.category}
        options={options.categories || defaults.categories}
        onChange={(v) => {
          onFilterChange("category", v);
          onFilterChange("tags", ""); // Reset tags when category changes
        }}
      />

      {/* Tags */}
      <FilterSelect
        label="Tags"
        value={filters.tags}
        options={visibleTags}
        disabled={!filters.category}
        onChange={(v) => onFilterChange("tags", v)}
      />

      {/* Payment */}
      <FilterSelect
        label="Payment Method"
        value={filters.paymentMethod}
        options={options.paymentMethods || defaults.paymentMethods}
        onChange={(v) => onFilterChange("paymentMethod", v)}
      />

      {/* Date Range - Updated to pass correct key */}
      <FilterSelect
        label="Date Range"
        value={filters.dateRange}
        options={dateRanges}
        onChange={(v) => onFilterChange("dateRange", v)}
      />
    </div>
  );
};

/* ===================== SELECT COMPONENT ===================== */

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
      className={`appearance-none px-4 py-1.5 pr-8 border rounded-md text-xs font-medium focus:outline-none transition cursor-pointer
        ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : value
            ? "border-green-500 bg-green-50 text-green-700"
            : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
        }
      `}
    >
      {/* FIX: The previous "disabled hidden" option prevented the label from showing 
         when the value was reset to empty string.
         This logic now correctly shows the label as a placeholder.
      */}
      <option value="">{label}</option> 

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

export default FilterBar;
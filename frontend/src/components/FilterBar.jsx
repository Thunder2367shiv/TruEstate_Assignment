import React, { useMemo, useState, useRef, useEffect } from "react";
import { RotateCcw, ChevronDown, Calendar, ArrowUpAZ, ArrowDownAZ, X } from "lucide-react";

/* ===================== CONFIGURATION ===================== */
const MIN_DATE = "2021-01-01"; 
const MAX_DATE = "2023-09-28";

/* ===================== FILTER BAR ===================== */

const FilterBar = ({ filters, options = {}, onFilterChange, onReset }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  const defaults = {
    regions: ["North", "South", "East", "West", "Central"],
    categories: ["Clothing", "Electronics", "Beauty"],
    paymentMethods: ["Credit Card", "Wallet", "UPI", "Cash"],
  };

  const ageRanges = ["0-18", "19-25", "26-35", "36-45", "46-60", "60+"];

  // Sort Options
  const sortOptions = [
    { label: "Date", value: "date" },
    { label: "Quantity", value: "quantity" },
    { label: "Amount", value: "amount" },
    { label: "Name", value: "name" },
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
    <div className="bg-white p-4 border-b border-gray-200 flex flex-wrap gap-3 items-center shadow-sm justify-between relative z-20">
      
      {/* LEFT SIDE: FILTERS */}
      <div className="flex flex-wrap gap-3 items-center">
        
        {/* Reset Button */}
        <button
          onClick={() => {
            setLocalSearch("");
            onReset();
          }}
          className="p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 rounded-full transition"
          title="Reset All Filters"
        >
          <RotateCcw size={16} />
        </button>

        {/* --- EXPANDABLE DATE RANGE PICKER --- */}
        <DateRangeDropdown 
          startDate={filters.startDate} 
          endDate={filters.endDate} 
          onFilterChange={onFilterChange} 
        />

        {/* --- STANDARD DROPDOWNS --- */}
        <FilterSelect
          label="Customer Region"
          value={filters.region}
          options={options.regions || defaults.regions}
          onChange={(v) => onFilterChange("region", v)}
        />
        
        <FilterSelect
          label="Gender"
          value={filters.gender}
          options={["Male", "Female"]}
          onChange={(v) => onFilterChange("gender", v)}
        />

        {/* --- RESTORED AGE RANGE --- */}
        <FilterSelect
          label="Age Range"
          value={filters.ageRange}
          options={ageRanges}
          onChange={(v) => onFilterChange("ageRange", v)}
        />

        <FilterSelect
          label="Product Category"
          value={filters.category}
          options={options.categories || defaults.categories}
          onChange={(v) => {
            onFilterChange("category", v);
            onFilterChange("tags", ""); 
          }}
        />

        <FilterSelect
          label="Tags"
          value={filters.tags}
          options={visibleTags}
          disabled={!filters.category}
          onChange={(v) => onFilterChange("tags", v)}
        />

        <FilterSelect
          label="Payment Method"
          value={filters.paymentMethod}
          options={options.paymentMethods || defaults.paymentMethods}
          onChange={(v) => onFilterChange("paymentMethod", v)}
        />
      </div>

      {/* RIGHT SIDE: SORTING CONTROLS */}
      <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
        <span className="text-xs text-gray-400 font-medium hidden sm:inline">Sort By:</span>
        
        <div className="relative">
          <select
            value={filters.sortBy || "date"}
            onChange={(e) => onFilterChange("sortBy", e.target.value)}
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-xs font-medium rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:border-green-500 cursor-pointer hover:bg-white transition-colors"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <ChevronDown size={12} />
          </div>
        </div>

        {/* Order Toggle Button */}
        <button
          onClick={() => onFilterChange("order", filters.order === "asc" ? "desc" : "asc")}
          className="p-1.5 border border-gray-200 rounded-md bg-white text-gray-500 hover:text-green-600 hover:border-green-500 transition-colors"
          title={filters.order === "asc" ? "Ascending (A-Z)" : "Descending (Z-A)"}
        >
          {filters.order === "asc" ? <ArrowUpAZ size={16} /> : <ArrowDownAZ size={16} />}
        </button>
      </div>

    </div>
  );
};

/* ===================== NEW: DATE RANGE DROPDOWN ===================== */

const DateRangeDropdown = ({ startDate, endDate, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Format label for display (e.g. "Jan 1 - Feb 5")
  const getLabel = () => {
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const end = new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${start} - ${end}`;
    }
    if (startDate) return `From ${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    return "Date Range";
  };

  const isActive = startDate || endDate;

  return (
    <div className="relative" ref={wrapperRef}>
      {/* The Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 border rounded-md text-xs font-medium transition-colors
          ${isActive 
            ? "border-green-500 bg-green-50 text-green-700" 
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"}
        `}
      >
        <Calendar size={14} className={isActive ? "text-green-600" : "text-gray-400"} />
        <span>{getLabel()}</span>
        
        {isActive ? (
           // Clear Date Button
           <div 
             onClick={(e) => {
               e.stopPropagation();
               onFilterChange("startDate", "");
               onFilterChange("endDate", "");
             }}
             className="ml-1 p-0.5 hover:bg-green-200 rounded-full"
           >
             <X size={12} />
           </div>
        ) : (
          <ChevronDown size={12} className="text-gray-400 ml-1" />
        )}
      </button>

      {/* The Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-xl z-50 flex flex-col gap-3 min-w-[280px]">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Start Date</span>
            <input
              type="date"
              min={MIN_DATE}
              max={endDate || MAX_DATE}
              value={startDate || ""}
              onChange={(e) => onFilterChange("startDate", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:border-green-500 focus:outline-none"
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">End Date</span>
            <input
              type="date"
              min={startDate || MIN_DATE}
              max={MAX_DATE}
              value={endDate || ""}
              onChange={(e) => onFilterChange("endDate", e.target.value)}
              className="w-full text-sm border border-gray-200 rounded px-2 py-1.5 focus:border-green-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* ===================== SELECT COMPONENT ===================== */

const FilterSelect = ({ label, value, options = [], onChange, disabled = false }) => (
  <div className="relative">
    <select
      value={value || ""}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`appearance-none px-3 py-1.5 pr-8 border rounded-md text-xs font-medium focus:outline-none transition cursor-pointer
        ${disabled
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : value
          ? "border-green-500 bg-green-50 text-green-700"
          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        }
      `}
    >
      {/* Placeholder (NOT selectable & NOT visible in list) */}
      <option value="" disabled hidden>
        {label}
      </option>

      {/* Actual selectable options */}
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
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce'; 

const Navbar = ({ onSearch }) => {
  // 1. Local State
  const [localSearch, setLocalSearch] = useState("");

  // 2. Debounce (Wait 500ms)
  const debouncedSearch = useDebounce(localSearch, 500);

  // 3. Track if it is the first render
  const isFirstRender = useRef(true);

  useEffect(() => {
    // STOP the effect from running on page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; 
    }

    // Only fire this AFTER the first render (when user types)
    onSearch(debouncedSearch);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]); 
  // ^ REMOVED 'onSearch' from dependencies to prevent Infinite Loop

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-800">Sales Management System</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600" size={18} />
          <input 
            type="text" 
            placeholder="Search by Name, Phone..." 
            value={localSearch} 
            onChange={(e) => setLocalSearch(e.target.value)} 
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
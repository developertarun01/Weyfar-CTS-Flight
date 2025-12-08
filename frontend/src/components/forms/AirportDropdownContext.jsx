// AirportDropdownContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AirportDropdownContext = createContext();

export const useAirportDropdown = () => {
  const context = useContext(AirportDropdownContext);
  if (!context) {
    throw new Error('useAirportDropdown must be used within AirportDropdownProvider');
  }
  return context;
};

export const AirportDropdownProvider = ({ children }) => {
  const [activeDropdown, setActiveDropdown] = useState({
    isOpen: false,
    suggestions: [],
    searchTerm: '',
    isLoading: false,
    onSelect: null,
    inputRef: null
  });

  const openDropdown = (suggestions, searchTerm, isLoading, onSelect, inputRef) => {
    setActiveDropdown({
      isOpen: true,
      suggestions,
      searchTerm,
      isLoading,
      onSelect,
      inputRef
    });
  };

  const closeDropdown = () => {
    setActiveDropdown(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <AirportDropdownContext.Provider value={{ activeDropdown, openDropdown, closeDropdown }}>
      {children}
    </AirportDropdownContext.Provider>
  );
};
import React, { useState, useRef, useEffect } from "react";

const SearchableDropdown = ({ options, onSelect, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const [selectedLabel, setSelectedLabel] = useState(
    placeholder || "Select an Option"
  );

  useEffect(() => {
    setSelectedLabel(placeholder);
  }, [placeholder]);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    onSelect(option);
    setSelectedLabel(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className={`btn btn-primary searchable-dropdown-button ${className}`}
        onClick={toggleDropdown}
      >
        {selectedLabel} {selectedLabel === placeholder}
      </button>

      {isOpen && (
        <div className="dropdown-menu show">
          <input
            ref={searchRef}
            className="form-control"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type to search..."
          />
          <div>
            {filteredOptions.map((option, index) => (
              <button
                key={index}
                className="dropdown-item"
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;

import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronDown } from 'react-icons/hi2';

const NavItem = ({ item, isHomePage = false, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const hasDropdown = item.dropdown && item.dropdown.length > 0;
  const textColor = isHomePage ? 'text-white' : 'text-gray-700';
  const hoverColor = isHomePage ? 'hover:text-highlight-400' : 'hover:text-primary-600';

  const handleMouseEnter = () => {
    if (hasDropdown) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => setIsOpen(false);

  const handleItemClick = () => {
    if (!hasDropdown && item.path && onClose) {
      onClose();
    }
  };

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.path && !hasDropdown ? (
        <Link
          to={item.path}
          onClick={handleItemClick}
          className={`flex items-center gap-1 ${textColor} ${hoverColor} font-medium transition-colors duration-200 py-2`}
        >
          {item.icon && <span className="text-lg">{item.icon}</span>}
          <span>{item.label}</span>
        </Link>
      ) : (
        <button
          className={`flex items-center gap-1 ${textColor} ${hoverColor} font-medium transition-colors duration-200 py-2`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {item.icon && <span className="text-lg">{item.icon}</span>}
          <span>{item.label}</span>
          {hasDropdown && (
            <HiOutlineChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          )}
        </button>
      )}

      {hasDropdown && (
        <div 
          className={`absolute top-full left-0 pt-2 z-50 transition-all duration-300 ease-in-out ${
            isOpen 
              ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
              : 'opacity-0 invisible -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
            {item.dropdown.map((dropdownItem, index) => (
              <Link
                key={index}
                to={dropdownItem.path || '#'}
                onClick={() => {
                  setIsOpen(false);
                  if (onClose) onClose();
                }}
                className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
              >
                {dropdownItem.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavItem;


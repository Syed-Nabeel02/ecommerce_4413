/**
 * CollapsiblePanel.jsx
 * Collapsible panel component with expand/collapse functionality.
 * Renamed from CollapsibleSection for better clarity.
 */

import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CollapsiblePanel = ({ title, isOpen, setIsOpen, children, icon: Icon }) => {
    return (
        <div className="border border-gray-300 rounded-md my-4">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="text-gray-700" />}
                    <span className="font-semibold text-gray-700">{title}</span>
                    <span className="text-sm text-gray-500">(Optional)</span>
                </div>
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-300">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CollapsiblePanel;

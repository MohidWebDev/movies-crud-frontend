// src/components/MultiSelectDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  maxSelected?: number;
  required?: boolean;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  maxSelected,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const summaryText =
    selected.length === 0
      ? `Select ${label.toLowerCase()}`
      : selected.length <= 2
        ? selected.join(", ")
        : `${selected.length} selected`;

  const limitReached =
    maxSelected !== undefined && selected.length >= maxSelected;

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      if (limitReached) return;
      onChange([...selected, option]);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
          {label} {required && "*"}
        </label>
        {maxSelected !== undefined && (
          <span
            className={`text-[10px] font-semibold ${
              limitReached ? "text-[#E50914]" : "text-zinc-500"
            }`}
          >
            {selected.length}/{maxSelected}
            {limitReached && " — max reached"}
          </span>
        )}
      </div>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-sm focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20 cursor-pointer"
      >
        <span
          className={selected.length === 0 ? "text-zinc-600" : "text-white"}
        >
          {summaryText}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-10 mt-2 w-full rounded-xl bg-[#181818] border border-zinc-800 shadow-xl max-h-40 overflow-y-auto"
        >
          {options.map((option) => {
            const isChecked = selected.includes(option);
            const isDisabled = !isChecked && limitReached;

            return (
              <label
                key={option}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                  isDisabled
                    ? "text-zinc-600 cursor-not-allowed"
                    : "text-zinc-300 cursor-pointer hover:bg-[#232323]"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isChecked
                      ? "bg-[#E50914] border-[#E50914]"
                      : isDisabled
                        ? "border-zinc-800"
                        : "border-zinc-600"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-white" />}
                </span>
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => toggleOption(option)}
                  className="hidden"
                />
                {option}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

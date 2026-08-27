import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SingleSelectDropdownProps {
  label: string;
  options: string[];
  selected: string;
  onChange: (selected: string) => void;
}

export const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
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

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
        {label}
      </label>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#181818] border border-zinc-800 text-sm focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20 cursor-pointer"
      >
        <span className="text-white">{selected}</span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-10 mt-2 w-full rounded-xl bg-[#181818] border border-zinc-800 shadow-xl max-h-60 overflow-y-auto"
        >
          {options.map((option) => {
            const isSelected = option === selected;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left text-zinc-300 cursor-pointer hover:bg-[#232323] transition-colors"
              >
                <span
                  className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isSelected
                      ? "bg-[#E50914] border-[#E50914]"
                      : "border-zinc-600"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </span>
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

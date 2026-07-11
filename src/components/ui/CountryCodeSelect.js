"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Search } from "lucide-react";
import COUNTRY_CODES from "@/lib/country-codes";

const DROPDOWN_WIDTH = 288;
const LIST_VISIBLE_ROWS = 6;
const ROW_HEIGHT = 40;
const LIST_HEIGHT = LIST_VISIBLE_ROWS * ROW_HEIGHT;

function subscribe() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export default function CountryCodeSelect({
  value,
  onChange,
  id = "country-code-select",
  ariaLabel = "Country calling code",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const mounted = useIsClient();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  const updatePosition = () => {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const dropdownHeight = 52 + LIST_HEIGHT;
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    setPosition({
      top: openAbove ? rect.top - dropdownHeight - 8 : rect.bottom + 8,
      left: Math.min(rect.left, window.innerWidth - DROPDOWN_WIDTH - 16),
    });
  };

  const toggleOpen = () => {
    if (!open) {
      setQuery("");
    }
    setOpen((current) => !current);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = setTimeout(() => searchRef.current?.focus(), 50);
    return () => clearTimeout(timer);
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleClickOutside(event) {
      const target = event.target;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleReposition() {
      updatePosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  const filteredCountries = COUNTRY_CODES.filter((country) => {
    const normalizedQuery = query.toLowerCase();
    return (
      country.name.toLowerCase().includes(normalizedQuery) ||
      country.dial_code.includes(query) ||
      country.code.toLowerCase().includes(normalizedQuery)
    );
  });

  const dropdown = open ? (
    <div
      ref={dropdownRef}
      id={`${id}-dropdown`}
      role="listbox"
      aria-label="Country calling codes"
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        width: DROPDOWN_WIDTH,
        zIndex: 9999,
      }}
      className="bg-[#090d1c] border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-enter-150"
    >
      <div className="p-3 border-b border-white/5 relative flex items-center">
        <Search
          className="absolute left-6 w-4 h-4 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={searchRef}
          type="text"
          placeholder="Search by country or code..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-slate-100 font-sans text-xs focus:outline-none focus:border-cyan-400 focus:bg-black/60 transition-colors"
        />
      </div>

      <div
        id={`${id}-list`}
        className="overflow-y-auto py-1.5 divide-y divide-white/[0.02]"
        style={{ height: LIST_HEIGHT }}
      >
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => {
            const isSelected = country.dial_code === value;

            return (
              <button
                key={`${country.code}-${country.dial_code}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(country.dial_code);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 text-xs font-sans transition-all flex items-center justify-between hover:bg-white/5 min-h-10 ${
                  isSelected
                    ? "text-cyan-400 bg-white/[0.02] font-semibold"
                    : "text-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-slate-400 w-10 shrink-0 select-all">
                    {country.dial_code}
                  </span>
                  <span className="truncate">{country.name}</span>
                </div>
              </button>
            );
          })
        ) : (
          <p className="px-4 py-3 text-xs text-slate-500 font-mono">
            No matching countries found.
          </p>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div
      ref={containerRef}
      id={id}
      className="relative inline-block w-full max-w-[140px]"
    >
      <button
        type="button"
        id={`${id}-trigger`}
        onClick={toggleOpen}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${ariaLabel}: ${value}`}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-3 text-slate-100 font-sans text-sm focus:outline-none focus:border-cyan-400 focus:bg-[#030712] transition-all cursor-pointer flex items-center justify-between gap-1.5 shadow-sm hover:border-white/20 active:scale-[0.98]"
      >
        <span className="truncate font-medium">{value}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {mounted && dropdown ? createPortal(dropdown, document.body) : null}
    </div>
  );
}

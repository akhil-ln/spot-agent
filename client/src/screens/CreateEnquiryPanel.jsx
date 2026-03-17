import React, { useState, useRef, useEffect, useCallback } from "react";
import "./CreateEnquiryPanel.css";
import {
  MapPin,
  ArrowDown,
  Truck,
  Layers,
  Weight,
  IndianRupee,
  Flame,
  CalendarClock,
  AlignLeft,
  X,
  ChevronDown,
  Loader2,
  CheckCircle2,
  Route,
} from "lucide-react";

const TRUCK_TYPES = [
  "15 MT OPENBODY",
  "20 MT CLOSED BODY",
  "10 MT CONTAINER",
  "32 MT TRAILER",
  "SXL CONTAINER",
  "MXL CONTAINER",
];

const URGENCY_OPTIONS = ["HIGH", "MEDIUM", "LOW"];
const DISPATCH_OPTIONS = ["oneway", "roundtrip"];

function LocationInput({ label, icon: Icon, value, onChange, placeholder }) {
  const [query, setQuery] = useState(value?.label || "");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchSuggestions = useCallback(async (q) => {
    if (!q || q.length < 3) { setSuggestions([]); return; }
    setLoading(true);
    try {
      let url = `https://production.lorri.in/api/apiuser/autocomplete?suggest=${q}&limit=20&searchFields=new_locations`
      const res = await fetch(
        url,
        { headers: { "Content-Type": "application/json" } }
      );
      const data = await res.json();
      setSuggestions(data?.value || []);
      setOpen(true);
    } catch {
      // fallback: mock suggestions derived from query for UI demo
      setSuggestions([
        { location: { suggestion: `${q}, Maharashtra`, label: `${q}, Maharashtra`, lat: 19.07, lon: 72.87 }, location_name: `${q}, Maharashtra`, coordinates: [72.87, 19.07] },
        { location: { suggestion: `${q}, Punjab`, label: `${q}, Punjab`, lat: 30.9, lon: 75.85 }, location_name: `${q}, Punjab`, coordinates: [75.85, 30.9] },
        { location: { suggestion: `${q}, Rajasthan`, label: `${q}, Rajasthan`, lat: 26.9, lon: 75.8 }, location_name: `${q}, Rajasthan`, coordinates: [75.8, 26.9] },
      ]);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    onChange(null); // clear selection when typing
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  }

  function handleSelect(item) {
    setQuery(item.location_name);
    onChange(item);
    setSuggestions([]);
    setOpen(false);
  }

  function handleClear() {
    setQuery("");
    onChange(null);
    setSuggestions([]);
  }

  const isSelected = !!value;

  return (
    <div className="cep-loc-wrap" ref={wrapRef}>
      <label className="cep-label">
        <Icon size={11} />
        {label}
      </label>
      <div className={`cep-loc-input-row ${isSelected ? "cep-loc-input-row--selected" : ""}`}>
        <input
          className="cep-loc-input"
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
        />
        <div className="cep-loc-suffix">
          {loading && <Loader2 size={13} className="cep-spinner" />}
          {!loading && isSelected && <CheckCircle2 size={13} className="cep-check" />}
          {!loading && query && (
            <button className="cep-clear-btn" onClick={handleClear} type="button">
              <X size={11} />
            </button>
          )}
        </div>
      </div>
      {open && suggestions.length > 0 && (
        <ul className="cep-suggestions">
          {suggestions.map((item, i) => (
            <li
              key={i}
              className="cep-suggestion-item"
              onMouseDown={() => handleSelect(item)}
            >
              <MapPin size={11} className="cep-suggestion-icon" />
              <span className="cep-suggestion-label">{item.location_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SelectField({ label, icon: Icon, value, onChange, options, placeholder }) {
  return (
    <div className="cep-field">
      <label className="cep-label">
        <Icon size={11} />
        {label}
      </label>
      <div className="cep-select-wrap">
        <select
          className="cep-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={13} className="cep-select-arrow" />
      </div>
    </div>
  );
}

function NumberField({ label, icon: Icon, value, onChange, placeholder, prefix }) {
  return (
    <div className="cep-field">
      <label className="cep-label">
        <Icon size={11} />
        {label}
      </label>
      <div className={`cep-number-wrap ${prefix ? "cep-number-wrap--prefix" : ""}`}>
        {prefix && <span className="cep-number-prefix">{prefix}</span>}
        <input
          type="number"
          className="cep-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={0}
        />
      </div>
    </div>
  );
}

const EMPTY_FORM = {
  origin: null,
  destination: null,
  truck_type: "",
  trucks_required: "",
  weight_mt: "",
  urgency: "",
  dispatch_type: "",
  cost_threshold: "",
  additional_details: "",
};

export default function CreateEnquiryPanel({ onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  function set(field) {
    return (val) => setForm((f) => ({ ...f, [field]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.origin || !form.destination || !form.truck_type || !form.urgency) return;
    const payload = {
      origin: form.origin.location_name,
      origin_coords: form.origin.coordinates,
      destination: form.destination.location_name,
      destination_coords: form.destination.coordinates,
      truck_type: form.truck_type,
      trucks_required: parseInt(form.trucks_required) || 1,
      weight_mt: parseFloat(form.weight_mt) || null,
      urgency: form.urgency,
      dispatch_type: form.dispatch_type || "oneway",
      cost_threshold: parseFloat(form.cost_threshold) || null,
      additional_details: form.additional_details,
      contract_tenure: "Spot",
      raised_at: new Date().toISOString(),
    };
    onSubmit?.(payload);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm(EMPTY_FORM);
    }, 2000);
  }

  const isValid = form.origin && form.destination && form.truck_type && form.urgency;

  return (
    <aside className="cep-panel">
      {/* Header */}
      <div className="cep-panel__header">
        <div className="cep-panel__title">
          <Route size={16} className="cep-panel__title-icon" />
          New spot enquiry
        </div>
        {onClose && (
          <button className="cep-panel__close" onClick={onClose} type="button">
            <X size={15} />
          </button>
        )}
      </div>

      <form className="cep-panel__body" onSubmit={handleSubmit}>
        {/* Route Section */}
        <div className="cep-section">
          <div className="cep-section-label">Route</div>
          <div className="cep-route-block">
            <LocationInput
              label="Origin"
              icon={MapPin}
              value={form.origin}
              onChange={set("origin")}
              placeholder="Type city or district…"
            />
            <div className="cep-route-divider">
              <ArrowDown size={13} className="cep-route-arrow" />
            </div>
            <LocationInput
              label="Destination"
              icon={MapPin}
              value={form.destination}
              onChange={set("destination")}
              placeholder="Type city or district…"
            />
          </div>
        </div>

        {/* Truck Section */}
        <div className="cep-section">
          <div className="cep-section-label">Truck details</div>
          <SelectField
            label="Truck type"
            icon={Truck}
            value={form.truck_type}
            onChange={set("truck_type")}
            options={TRUCK_TYPES}
            placeholder="Select type…"
          />
          <div className="cep-row">
            <NumberField
              label="Trucks required"
              icon={Layers}
              value={form.trucks_required}
              onChange={set("trucks_required")}
              placeholder="1"
            />
            <NumberField
              label="Weight (MT)"
              icon={Weight}
              value={form.weight_mt}
              onChange={set("weight_mt")}
              placeholder="15"
            />
          </div>
        </div>

        {/* Shipment Section */}
        <div className="cep-section">
          <div className="cep-section-label">Shipment</div>
          <div className="cep-row">
            <SelectField
              label="Urgency"
              icon={Flame}
              value={form.urgency}
              onChange={set("urgency")}
              options={URGENCY_OPTIONS}
              placeholder="Select…"
            />
            <SelectField
              label="Dispatch type"
              icon={CalendarClock}
              value={form.dispatch_type}
              onChange={set("dispatch_type")}
              options={DISPATCH_OPTIONS}
              placeholder="Select…"
            />
          </div>
          <NumberField
            label="Cost threshold"
            icon={IndianRupee}
            value={form.cost_threshold}
            onChange={set("cost_threshold")}
            placeholder="45,000"
            prefix="₹"
          />
        </div>

        {/* Notes */}
        <div className="cep-section">
          <div className="cep-section-label">Notes</div>
          <div className="cep-field">
            <label className="cep-label">
              <AlignLeft size={11} />
              Additional details
            </label>
            <textarea
              className="cep-textarea"
              rows={3}
              value={form.additional_details}
              onChange={(e) => set("additional_details")(e.target.value)}
              placeholder="Fragile goods, special handling…"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`cep-submit ${!isValid ? "cep-submit--disabled" : ""} ${submitted ? "cep-submit--success" : ""}`}
          disabled={!isValid}
        >
          {submitted ? (
            <>
              <CheckCircle2 size={14} />
              Enquiry raised
            </>
          ) : (
            <>
              <Route size={14} />
              Raise spot enquiry
            </>
          )}
        </button>
      </form>
    </aside>
  );
}
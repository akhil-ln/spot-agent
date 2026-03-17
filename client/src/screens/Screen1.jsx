import React, { useState } from "react";
import "./Screen1.css";
import CreateEnquiryPanel from "./CreateEnquiryPanel.jsx";
import {
  Truck,
  Hash,
  Calendar,
  MapPin,
  ArrowRight,
  Flame,
  CircleAlert,
  CircleCheck,
  Layers,
  IndianRupee,
  Info,
  MessageSquare,
  ChevronRight,
  Plus,
} from "lucide-react";

function formatDate(str) {
  if (!str) return "—";
  try {
    return new Date(str).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return str;
  }
}

function UrgencyBadge({ urgency }) {
  const configs = {
    HIGH: { cls: "sr1-badge--high", Icon: Flame },
    MEDIUM: { cls: "sr1-badge--medium", Icon: CircleAlert },
    LOW: { cls: "sr1-badge--low", Icon: CircleCheck },
  };
  const { cls, Icon } = configs[urgency] || { cls: "sr1-badge--low", Icon: CircleCheck };
  return (
    <span className={`sr1-badge ${cls}`}>
      <Icon size={9} />
      {urgency}
    </span>
  );
}

function Chip({ icon: Icon, label }) {
  return (
    <span className="sr1-chip">
      {Icon && <Icon size={11} className="sr1-chip__icon" />}
      {label}
    </span>
  );
}

function RequestCard({ scenario, onClick }) {
  const [hover, setHover] = useState(false);
  const req = scenario.spot_request;
  const qCount = scenario.quotes?.length || 0;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`sr1-card ${hover ? "sr1-card--hover" : ""}`}
    >
      <div className="sr1-card__top">
        <div>
          <div className="sr1-card__meta">
            <Hash size={11} />
            {req.id}
            <span className="sr1-card__meta-dot">·</span>
            <Calendar size={11} />
            {formatDate(req.raised_at)}
          </div>
          <div className="sr1-card__lane">
            <MapPin size={13} className="sr1-card__lane-icon" />
            <span>{req.origin}</span>
            <ArrowRight size={13} className="sr1-card__lane-arrow" />
            <span>{req.destination}</span>
          </div>
        </div>
        <UrgencyBadge urgency={req.urgency} />
      </div>

      <div className="sr1-card__chips">
        <Chip icon={Truck} label={req.truck_type} />
        <Chip
          icon={Layers}
          label={req.trucks_required > 1 ? `${req.trucks_required} trucks` : "1 truck"}
        />
        <Chip
          icon={IndianRupee}
          label={`Threshold ₹${(req.cost_threshold || 0).toLocaleString("en-IN")}`}
        />
        {req.additional_details && (
          <Chip icon={Info} label={req.additional_details} />
        )}
      </div>

      <div className="sr1-card__bottom">
        <div className="sr1-card__quote-count">
          <MessageSquare size={13} />
          <strong>{qCount}</strong>&nbsp;quote{qCount !== 1 ? "s" : ""} received
        </div>
        <div className={`sr1-card__view-link ${hover ? "sr1-card__view-link--active" : ""}`}>
          View quotes <ChevronRight size={13} />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="sr1-skeleton">
      <div className="sr1-skeleton__line sr1-skeleton__line--sm" />
      <div className="sr1-skeleton__line sr1-skeleton__line--md" />
      <div className="sr1-skeleton__line sr1-skeleton__line--xs" />
    </div>
  );
}

export default function Screen1({ scenarios, loading, onSelect, onEnquirySubmit }) {
  const [showPanel, setShowPanel] = useState(true);

  return (
    <div className="sr1-page">
      {/* Left: list */}
      <div className="sr1-main">
        <div className="sr1-header">
          <div className="sr1-header__left">
            <h1 className="sr1-header__title">
              <Truck size={20} className="sr1-header__icon" />
              Active spot requests
            </h1>
            <p className="sr1-header__sub">
              Select a shipment to view transporter quotes and run AI analysis.
            </p>
          </div>
          {!showPanel && (
            <button
              className="sr1-new-btn"
              onClick={() => setShowPanel(true)}
            >
              <Plus size={14} />
              New enquiry
            </button>
          )}
        </div>

        <div className="sr1-card-list">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : scenarios.map((s) => (
                <RequestCard
                  key={s.scenario_id}
                  scenario={s}
                  onClick={() => onSelect(s)}
                />
              ))}
        </div>
      </div>

      {/* Right: create panel */}
      {showPanel && (
        <CreateEnquiryPanel
          onClose={() => setShowPanel(false)}
          onSubmit={(payload) => {
            onEnquirySubmit?.(payload);
          }}
        />
      )}
    </div>
  );
}
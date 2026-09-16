import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  ChevronRight,
  Compass,
  Flame,
  Heart,
  ImagePlus,
  Info,
  MapPin,
  Menu,
  Milestone,
  Plus,
  Route,
  Sparkles,
  Target,
  Trash2,
  X,
} from "lucide-react";
import {
  CircuitLocation,
  INITIAL_CIRCUITS,
  PilgrimageCircuit,
} from "./data/pilgrimageCircuits";

type Goal = { name: string; completed: number; total: number; accent: string };
type Journey = {
  name: string;
  completedAt: string;
  place: string;
  nextPlan: string;
  nextPlanNote: string;
  goals: Goal[];
};
type MemoryPhoto = { id: string; name: string; url: string; caption: string };

const fallbackJourney: Journey = {
  name: "Raj",
  completedAt: "6 July 2026",
  place: "Tirumala (Tirupati)",
  nextPlan: "Srisailam",
  nextPlanNote: "Next destination to plan",
  goals: [
    { name: "12 Jyotirlingas", completed: 0, total: 12, accent: "saffron" },
    { name: "Panch Kedar", completed: 0, total: 5, accent: "forest" },
    { name: "Char Dham", completed: 0, total: 4, accent: "sky" },
    { name: "Panch Kailash", completed: 0, total: 5, accent: "plum" },
    { name: "Tirumala (Tirupati)", completed: 1, total: 1, accent: "gold" },
  ],
};

const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/journey`;
const DEFAULT_PHOTO: MemoryPhoto = {
  id: "tirumala-memory",
  name: "Tirumala sunrise",
  url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=82",
  caption: "A quiet morning at Tirumala",
};

export function App() {
  const [journey, setJourney] = useState<Journey>(fallbackJourney);
  const [circuits, setCircuits] = useState<PilgrimageCircuit[]>(() => {
    try {
      const saved = localStorage.getItem("sacred-journey-circuits");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure coverImage exists from INITIAL_CIRCUITS
        return INITIAL_CIRCUITS.map((init) => {
          const matched = parsed.find((p: PilgrimageCircuit) => p.id === init.id);
          return matched ? { ...init, locations: matched.locations } : init;
        });
      }
    } catch {
      /* fallback */
    }
    return INITIAL_CIRCUITS;
  });

  const [selectedCircuit, setSelectedCircuit] = useState<PilgrimageCircuit | null>(null);
  const [locationFilter, setLocationFilter] = useState<"all" | "visited" | "pending">("all");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [photos, setPhotos] = useState<MemoryPhoto[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("sacred-journey-photos") || "null") || [
          DEFAULT_PHOTO,
        ]
      );
    } catch {
      return [DEFAULT_PHOTO];
    }
  });

  // Fetch backend journey data if running
  useEffect(() => {
    fetch(API_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Journey) => {
        setJourney((prev) => ({
          ...prev,
          name: data.name || prev.name,
          completedAt: data.completedAt || prev.completedAt,
          place: data.place || prev.place,
          nextPlan: data.nextPlan || prev.nextPlan,
          nextPlanNote: data.nextPlanNote || prev.nextPlanNote,
        }));
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  // Save circuits to localStorage
  useEffect(() => {
    localStorage.setItem("sacred-journey-circuits", JSON.stringify(circuits));
  }, [circuits]);

  // Save photos to localStorage
  useEffect(() => {
    localStorage.setItem("sacred-journey-photos", JSON.stringify(photos));
  }, [photos]);

  // Dynamic calculations for circuits
  const circuitStats = useMemo(() => {
    return circuits.map((c) => {
      const visited = c.locations.filter((loc) => loc.visited).length;
      const total = c.locations.length;
      const percentage = Math.round((visited / total) * 100);
      return {
        id: c.id,
        name: c.name,
        subtitle: c.subtitle,
        description: c.description,
        coverImage: c.coverImage,
        accent: c.accent,
        visited,
        total,
        percentage,
        isComplete: visited === total,
        locations: c.locations,
      };
    });
  }, [circuits]);

  const totalVisited = useMemo(
    () => circuitStats.reduce((sum, c) => sum + c.visited, 0),
    [circuitStats]
  );
  const totalShrines = useMemo(
    () => circuitStats.reduce((sum, c) => sum + c.total, 0),
    [circuitStats]
  );
  const overallPercent = Math.round((totalVisited / (totalShrines || 1)) * 100);

  function toggleLocationVisited(circuitId: string, locationId: string) {
    setCircuits((prev) =>
      prev.map((c) => {
        if (c.id !== circuitId) return c;
        const updated = c.locations.map((loc) => {
          if (loc.id !== locationId) return loc;
          const nextVisited = !loc.visited;
          return {
            ...loc,
            visited: nextVisited,
            visitedDate: nextVisited
              ? loc.visitedDate ||
                new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : undefined,
          };
        });
        return { ...c, locations: updated };
      })
    );

    // Keep active modal updated in real-time
    setSelectedCircuit((curr) => {
      if (!curr || curr.id !== circuitId) return curr;
      return {
        ...curr,
        locations: curr.locations.map((loc) => {
          if (loc.id !== locationId) return loc;
          const nextVisited = !loc.visited;
          return {
            ...loc,
            visited: nextVisited,
            visitedDate: nextVisited
              ? loc.visitedDate ||
                new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : undefined,
          };
        }),
      };
    });
  }

  function handlePhotoUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((current) => [
          ...current,
          {
            id: `photo-${Date.now()}-${Math.random()}`,
            name: file.name.replace(/\.[^/.]+$/, ""),
            url: String(reader.result),
            caption: "Sacred pilgrimage memory",
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((curr) => curr.filter((p) => p.id !== id));
  }

  async function handleSavePlan(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nextPlan = String(form.get("nextPlan") || "Srisailam");
    const nextPlanNote = String(form.get("note") || "Next destination to plan");
    setJourney((prev) => ({ ...prev, nextPlan, nextPlanNote }));
    setSavedSuccess(true);
    setShowPlanModal(false);
    try {
      await fetch(`${API_URL}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nextPlan, nextPlanNote }),
      });
    } catch {
      /* Keep local state responsive offline */
    }
  }

  return (
    <div className="site-wrapper">
      {/* ========================================================
          1. TOP NAVIGATION BAR (Clean, Modern, Accessible)
         ======================================================== */}
      <header className="site-header">
        <div className="header-inner">
          <a href="#overview" className="header-brand">
            <div className="brand-icon">
              <Sparkles size={18} />
            </div>
            <div className="brand-text">
              <span>Sacred</span>
              <span className="brand-accent">Journey</span>
            </div>
          </a>

          <nav className="header-nav" aria-label="Main Navigation">
            <a href="#overview" className="nav-link active">
              <Compass size={15} /> Home
            </a>
            <a href="#progress" className="nav-link">
              <Target size={15} /> My Journey
            </a>
            <a href="#circuits" className="nav-link">
              <Milestone size={15} /> Pilgrimages
            </a>
            <a href="#memories" className="nav-link">
              <Camera size={15} /> Memories
            </a>
          </nav>

          <div className="header-actions">
            <div className="user-profile-pill">
              <div className="avatar-circle">R</div>
              <div className="user-info">
                <strong>{journey.name}</strong>
                <small>1 Visited</small>
              </div>
            </div>

            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-menu">
            <a
              href="#overview"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass size={16} /> Home
            </a>
            <a
              href="#progress"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Target size={16} /> My Journey (Progress)
            </a>
            <a
              href="#circuits"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Milestone size={16} /> Pilgrimage Circuits
            </a>
            <a
              href="#memories"
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Camera size={16} /> Memories &amp; Notes
            </a>
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main className="site-main">
        {/* ========================================================
            2. HERO SECTION (Clean, Compact, Inspiring, NOT Bloated)
           ======================================================== */}
        <section className="hero-banner" id="overview">
          <div className="hero-container">
            <div className="hero-badge">
              <Flame size={13} />
              <span>Spiritual Pilgrimage Tracker</span>
            </div>

            <h1 className="hero-title">
              Sacred Journey
            </h1>

            <p className="hero-desc">
              Track your spiritual pilgrimages across India&apos;s sacred circuits, preserve
              memorable moments, and walk your path of divine devotion.
            </p>

            <div className="hero-button-row">
              <a href="#progress" className="btn-primary">
                Explore My Journey <ArrowRight size={16} />
              </a>
              <button
                className="btn-outline"
                onClick={() => {
                  setSavedSuccess(false);
                  setShowPlanModal(true);
                }}
              >
                Plan Next Shrine <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="hero-quick-meta">
              <div className="meta-pill">
                <Check size={13} />
                <span>
                  <strong>{journey.place}</strong> visited ({journey.completedAt})
                </span>
              </div>
              <div className="meta-pill">
                <MapPin size={13} />
                <span>
                  Next: <strong>{journey.nextPlan}</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="content-container">
          {savedSuccess && (
            <div className="alert-banner" role="status">
              <Check size={16} />
              <span>Your upcoming destination plan has been saved successfully.</span>
            </div>
          )}

          {/* ========================================================
              3. MY JOURNEY / PROGRESS (Prominent, High-Priority)
             ======================================================== */}
          <section className="section-container" id="progress">
            <div className="section-title-bar">
              <div>
                <span className="section-tag">OVERVIEW</span>
                <h2>My Pilgrimage Progress</h2>
              </div>
              <div className="section-stat-badge">
                <strong>{totalVisited}</strong> of <strong>{totalShrines}</strong> Shrines Visited
              </div>
            </div>

            {/* Overall Progress Dashboard Strip */}
            <div className="progress-overview-strip">
              <div className="overall-ring-col">
                <div className="ring-wrap">
                  <svg viewBox="0 0 100 100" className="ring-svg">
                    <circle cx="50" cy="50" r="42" className="ring-bg" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="ring-bar"
                      style={{
                        strokeDasharray: 263.89,
                        strokeDashoffset:
                          263.89 - (overallPercent / 100) * 263.89,
                      }}
                    />
                  </svg>
                  <div className="ring-text">
                    <span className="ring-number">{overallPercent}%</span>
                    <span className="ring-sub">Done</span>
                  </div>
                </div>
              </div>

              <div className="overall-metrics-col">
                <div className="metric-box">
                  <span className="metric-label">Completed Shrines</span>
                  <span className="metric-val completed">{totalVisited}</span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Remaining Shrines</span>
                  <span className="metric-val remaining">
                    {totalShrines - totalVisited}
                  </span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Active Circuits</span>
                  <span className="metric-val active">
                    {circuitStats.filter((c) => c.visited > 0).length} of 5
                  </span>
                </div>
                <div className="metric-box">
                  <span className="metric-label">Next Destination</span>
                  <span className="metric-val next">{journey.nextPlan}</span>
                </div>
              </div>
            </div>

            {/* Compact Circuit Progress Cards Grid */}
            <div className="progress-cards-grid">
              {circuitStats.map((c) => (
                <div
                  className="circuit-progress-card"
                  key={c.id}
                  onClick={() => {
                    const match = circuits.find((item) => item.id === c.id);
                    if (match) setSelectedCircuit(match);
                    setLocationFilter("all");
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="c-progress-header">
                    <div className="c-title-wrap">
                      <span className={`dot-indicator ${c.accent}`} />
                      <h4>{c.name}</h4>
                    </div>
                    {c.isComplete ? (
                      <span className="status-tag complete">
                        <Check size={11} /> Completed
                      </span>
                    ) : c.visited > 0 ? (
                      <span className="status-tag in-progress">
                        {c.visited}/{c.total} Visited
                      </span>
                    ) : (
                      <span className="status-tag not-started">
                        0/{c.total}
                      </span>
                    )}
                  </div>

                  <div className="c-bar-wrap">
                    <div className="mini-bar">
                      <div
                        className={`mini-bar-fill ${c.accent}`}
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                    <span className="c-percent-text">{c.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================
              4. PILGRIMAGE CIRCUITS (Visual Grid with Images & Actions)
             ======================================================== */}
          <section className="section-container" id="circuits">
            <div className="section-title-bar">
              <div>
                <span className="section-tag">EXPLORE</span>
                <h2>Pilgrimage Circuits</h2>
              </div>
              <p className="section-subtitle">
                Explore the five divine pilgrimage routes across Bharat and track your steps.
              </p>
            </div>

            <div className="circuits-visual-grid">
              {circuitStats.map((c) => (
                <article className="circuit-visual-card" key={c.id}>
                  <div className="circuit-img-wrap">
                    <img
                      src={c.coverImage}
                      alt={c.name}
                      loading="lazy"
                    />
                    <div className="circuit-img-overlay">
                      <span className="circuit-places-count">
                        {c.total} Sacred Places
                      </span>
                      {c.isComplete && (
                        <span className="circuit-badge-done">
                          <Check size={12} /> Visited
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="circuit-card-body">
                    <div className="circuit-card-title-row">
                      <h3>{c.name}</h3>
                      <span className="circuit-count-pill">
                        {c.visited} / {c.total}
                      </span>
                    </div>

                    <p className="circuit-card-desc">{c.subtitle}</p>

                    <div className="circuit-card-progress">
                      <div className="bar-track">
                        <div
                          className={`bar-fill ${c.accent}`}
                          style={{ width: `${c.percentage}%` }}
                        />
                      </div>
                      <span className="progress-num">{c.percentage}%</span>
                    </div>

                    <button
                      className="btn-explore-circuit"
                      onClick={() => {
                        const match = circuits.find((item) => item.id === c.id);
                        if (match) setSelectedCircuit(match);
                        setLocationFilter("all");
                      }}
                    >
                      Explore Shrines <ChevronRight size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* ========================================================
              5. RECENT JOURNEY & MEMORIES (Compact & Content-Driven)
             ======================================================== */}
          <section className="section-container" id="memories">
            <div className="section-title-bar">
              <div>
                <span className="section-tag">SACRED ARCHIVES</span>
                <h2>Recent Journey &amp; Memories</h2>
              </div>
              <label className="btn-upload-photos">
                <ImagePlus size={15} /> Add Memories
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>

            <div className="memories-compact-grid">
              {/* Completed Journey Milestone Card */}
              <div className="milestone-highlight-card">
                <div className="milestone-badge">
                  <Check size={13} />
                  <span>First Completed Pilgrimage</span>
                </div>
                <h3>{journey.place}</h3>
                <div className="milestone-date">
                  <CalendarDays size={13} /> Completed on {journey.completedAt}
                </div>
                <p className="milestone-desc">
                  Tirumala established the foundation of Raj&apos;s sacred journey. The
                  seven holy hills, the divine darshan of Lord Sri Venkateswara,
                  and the spiritual blessings opened the path ahead.
                </p>
                <div className="milestone-note">
                  “A peaceful beginning. The path is open and filled with grace.”
                </div>
              </div>

              {/* Next Planned Destination Card */}
              <div className="next-dest-highlight-card">
                <div className="next-badge">
                  <MapPin size={13} />
                  <span>Next Destination</span>
                </div>
                <h3>{journey.nextPlan}</h3>
                <p className="next-desc">
                  {journey.nextPlanNote ||
                    "Prepare your itinerary, route, and spiritual intention for this sacred shrine."}
                </p>
                <button
                  className="btn-edit-plan"
                  onClick={() => {
                    setSavedSuccess(false);
                    setShowPlanModal(true);
                  }}
                >
                  Edit Next Plan <ArrowUpRight size={14} />
                </button>
              </div>
            </div>

            {/* Photo Memories Gallery Strip */}
            <div className="photo-memories-strip">
              <div className="photo-memories-header">
                <h4>Photo Memories ({photos.length})</h4>
                <label className="link-add-photo">
                  <Plus size={14} /> Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>

              <div className="photo-cards-row">
                {photos.map((photo) => (
                  <div className="photo-card-compact" key={photo.id}>
                    <img src={photo.url} alt={photo.caption} loading="lazy" />
                    <button
                      className="photo-remove-btn"
                      onClick={() => removePhoto(photo.id)}
                      aria-label="Remove photo"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="photo-caption-bar">
                      <span>{photo.caption}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Sparkles size={16} />
            <span>Sacred Journey</span>
            <small>Personal Pilgrimage Companion</small>
          </div>
          <div className="footer-circuits">
            12 Jyotirlingas • Panch Kedar • Char Dham • Panch Kailash • Tirumala
          </div>
          <div className="footer-copy">
            Dedicated to the road ahead, {journey.name}.
          </div>
        </div>
      </footer>

      {/* ========================================================
          MODAL: Plan Next Destination
         ======================================================== */}
      {showPlanModal && (
        <div className="modal-overlay" onClick={() => setShowPlanModal(false)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-card-header">
              <h3>Plan Next Pilgrimage</h3>
              <button
                className="btn-modal-close"
                onClick={() => setShowPlanModal(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSavePlan}>
              <div className="form-group">
                <label>Destination Name</label>
                <input
                  name="nextPlan"
                  defaultValue={journey.nextPlan}
                  required
                  placeholder="e.g. Srisailam, Kedarnath, Somnath"
                />
              </div>
              <div className="form-group">
                <label>Notes &amp; Travel Itinerary</label>
                <input
                  name="note"
                  defaultValue={journey.nextPlanNote}
                  placeholder="e.g. Planning a weekend darshan via Hyderabad"
                />
              </div>
              <div className="modal-button-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowPlanModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Plan <Check size={15} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: Pilgrimage Circuit Explorer & Location Checklist
         ======================================================== */}
      {selectedCircuit && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedCircuit(null)}
        >
          <div
            className="circuit-explorer-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="explorer-header">
              <div>
                <div className="explorer-badge">
                  <span className={`dot-indicator ${selectedCircuit.accent}`} />
                  <span>PILGRIMAGE CIRCUIT EXPLORER</span>
                </div>
                <h2>{selectedCircuit.name}</h2>
                <p className="explorer-desc">{selectedCircuit.description}</p>
              </div>
              <button
                className="btn-modal-close"
                onClick={() => setSelectedCircuit(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress summary inside modal */}
            <div className="explorer-progress-strip">
              <div className="exp-progress-label">
                <span>
                  <strong>
                    {selectedCircuit.locations.filter((l) => l.visited).length}
                  </strong>{" "}
                  of <strong>{selectedCircuit.locations.length}</strong> shrines visited
                </span>
                <span className="exp-percent">
                  {Math.round(
                    (selectedCircuit.locations.filter((l) => l.visited).length /
                      selectedCircuit.locations.length) *
                      100
                  )}
                  % Complete
                </span>
              </div>
              <div className="mini-bar large">
                <div
                  className={`mini-bar-fill ${selectedCircuit.accent}`}
                  style={{
                    width: `${
                      (selectedCircuit.locations.filter((l) => l.visited).length /
                        selectedCircuit.locations.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="explorer-filters">
              <button
                className={`filter-btn ${locationFilter === "all" ? "active" : ""}`}
                onClick={() => setLocationFilter("all")}
              >
                All ({selectedCircuit.locations.length})
              </button>
              <button
                className={`filter-btn ${locationFilter === "visited" ? "active" : ""}`}
                onClick={() => setLocationFilter("visited")}
              >
                Visited ({selectedCircuit.locations.filter((l) => l.visited).length})
              </button>
              <button
                className={`filter-btn ${locationFilter === "pending" ? "active" : ""}`}
                onClick={() => setLocationFilter("pending")}
              >
                Remaining ({selectedCircuit.locations.filter((l) => !l.visited).length})
              </button>
            </div>

            {/* Locations List */}
            <div className="explorer-locations-grid">
              {selectedCircuit.locations
                .filter((loc) => {
                  if (locationFilter === "visited") return loc.visited;
                  if (locationFilter === "pending") return !loc.visited;
                  return true;
                })
                .map((loc, idx) => (
                  <div
                    className={`location-item-card ${
                      loc.visited ? "visited" : ""
                    }`}
                    key={loc.id}
                  >
                    <div className="loc-thumb-wrap">
                      <img
                        src={loc.imageUrl}
                        alt={loc.name}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                      <span className="loc-index">#{idx + 1}</span>
                    </div>

                    <div className="loc-info">
                      <div className="loc-header-row">
                        <h4>{loc.name}</h4>
                        <span className="loc-state">
                          <MapPin size={11} /> {loc.state}
                        </span>
                      </div>

                      {loc.deity && (
                        <span className="loc-deity">
                          <strong>Deity:</strong> {loc.deity}
                        </span>
                      )}

                      <p className="loc-description">{loc.description}</p>

                      {loc.visited && loc.visitedDate && (
                        <div className="loc-visited-tag">
                          <Check size={12} /> Visited on {loc.visitedDate}
                        </div>
                      )}

                      <button
                        className={`btn-toggle-visited ${
                          loc.visited ? "is-visited" : "not-visited"
                        }`}
                        onClick={() =>
                          toggleLocationVisited(selectedCircuit.id, loc.id)
                        }
                      >
                        {loc.visited ? (
                          <>
                            <Check size={13} /> Visited
                          </>
                        ) : (
                          <>
                            <Plus size={13} /> Mark as Visited
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="explorer-footer">
              <button
                className="btn-secondary"
                onClick={() => setSelectedCircuit(null)}
              >
                Close Explorer
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="site-loading-bar" />}
    </div>
  );
}

export default App;

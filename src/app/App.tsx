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
  Globe,
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

function ProgressRing({ value }: { value: number }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="ring-container">
      <svg
        className="ring-svg"
        viewBox="0 0 120 120"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${value}% of pilgrimage journey completed`}
      >
        <circle
          className="ring-track"
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="9"
        />
        <circle
          className="ring-value"
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="9"
          style={{
            strokeDasharray: `${circumference}px`,
            strokeDashoffset: `${strokeDashoffset}px`,
          }}
        />
      </svg>
      <div className="ring-label">
        <strong>{value}%</strong>
        <span>completed</span>
      </div>
    </div>
  );
}

export function App() {
  const [journey, setJourney] = useState<Journey>(fallbackJourney);
  const [circuits, setCircuits] = useState<PilgrimageCircuit[]>(() => {
    try {
      const saved = localStorage.getItem("sacred-journey-circuits");
      if (saved) return JSON.parse(saved);
    } catch {
      /* fallback */
    }
    return INITIAL_CIRCUITS;
  });
  const [selectedCircuit, setSelectedCircuit] = useState<PilgrimageCircuit | null>(null);
  const [locationFilter, setLocationFilter] = useState<"all" | "visited" | "pending">("all");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [saved, setSaved] = useState(false);
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

  // Fetch from backend API if available
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

  // Sync circuits to local storage
  useEffect(() => {
    localStorage.setItem("sacred-journey-circuits", JSON.stringify(circuits));
  }, [circuits]);

  // Sync photos to local storage
  useEffect(() => {
    localStorage.setItem("sacred-journey-photos", JSON.stringify(photos));
  }, [photos]);

  // Dynamically compute completed counts from circuits
  const circuitGoals = useMemo(() => {
    return circuits.map((c) => {
      const completedCount = c.locations.filter((loc) => loc.visited).length;
      return {
        id: c.id,
        name: c.name,
        completed: completedCount,
        total: c.locations.length,
        accent: c.accent,
        subtitle: c.subtitle,
      };
    });
  }, [circuits]);

  const totalCompleted = useMemo(
    () => circuitGoals.reduce((sum, g) => sum + g.completed, 0),
    [circuitGoals]
  );
  const totalLocations = useMemo(
    () => circuitGoals.reduce((sum, g) => sum + g.total, 0),
    [circuitGoals]
  );
  const overallPercentage = Math.round((totalCompleted / (totalLocations || 1)) * 100);

  function toggleLocationVisited(circuitId: string, locationId: string) {
    setCircuits((prev) =>
      prev.map((circuit) => {
        if (circuit.id !== circuitId) return circuit;
        const updatedLocations = circuit.locations.map((loc) => {
          if (loc.id !== locationId) return loc;
          const nextVisited = !loc.visited;
          return {
            ...loc,
            visited: nextVisited,
            visitedDate: nextVisited
              ? loc.visitedDate || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
              : undefined,
          };
        });
        return { ...circuit, locations: updatedLocations };
      })
    );

    // Keep active modal in sync
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
              ? loc.visitedDate || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
              : undefined,
          };
        }),
      };
    });
  }

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((current) => [
          ...current,
          {
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            name: file.name.replace(/\.[^/.]+$/, ""),
            url: String(reader.result),
            caption: "Sacred pilgrimage memory",
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((curr) => curr.filter((p) => p.id !== id));
  }

  async function savePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextPlan = String(form.get("nextPlan") || "Srisailam");
    const nextPlanNote = String(form.get("note") || "Next destination to plan");
    setJourney((prev) => ({ ...prev, nextPlan, nextPlanNote }));
    setSaved(true);
    setShowPlan(false);
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
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>
          <span>
            Sacred<span>Journey</span>
          </span>
        </div>

        <div className="profile-chip">
          <div className="avatar">R</div>
          <div className="profile-info">
            <strong>{journey.name}</strong>
            <small>Devotee &amp; Pilgrim</small>
          </div>
        </div>

        <nav aria-label="Main Navigation">
          <p className="nav-label">Navigation</p>
          <a
            className="nav-item active"
            href="#overview"
            onClick={() => setMenuOpen(false)}
          >
            <Compass size={17} /> Overview
          </a>
          <a
            className="nav-item"
            href="#my-journey"
            onClick={() => setMenuOpen(false)}
          >
            <Target size={17} /> My Progress
            <span className="nav-count">{overallPercentage}%</span>
          </a>
          <a
            className="nav-item"
            href="#circuits"
            onClick={() => setMenuOpen(false)}
          >
            <Milestone size={17} /> Pilgrimage Circuits
            <span className="nav-count">{circuits.length}</span>
          </a>
          <a
            className="nav-item"
            href="#next-plan"
            onClick={() => setMenuOpen(false)}
          >
            <CalendarDays size={17} /> Up Next
          </a>
          <a
            className="nav-item"
            href="#memories"
            onClick={() => setMenuOpen(false)}
          >
            <Camera size={17} /> Memories
            <span className="nav-count">{photos.length}</span>
          </a>
          <a
            className="nav-item"
            href="#story"
            onClick={() => setMenuOpen(false)}
          >
            <Route size={17} /> Pilgrimage Story
          </a>
        </nav>

        <div className="sidebar-quote">
          <Heart size={15} fill="currentColor" />
          <p>“The journey itself is the prayer.”</p>
        </div>

        <div className="sidebar-footer">
          Sacred Journey <span>v1.0</span>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="mobile-scrim"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar">
          <button
            className="icon-button menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="eyebrow">DIGITAL PILGRIMAGE COMPANION</div>
          <div className="topbar-right">
            <span className="live-dot" />
            <span>Active Journey</span>
            <div className="avatar small">R</div>
          </div>
        </header>

        <div className="content-wrap">
          {/* 1. Hero Section */}
          <section className="hero" id="overview">
            <div className="hero-copy">
              <div className="kicker">
                <Flame size={14} /> Sacred Path of Devotion
              </div>
              <h1>
                Keep walking,<br />
                <em>{journey.name}.</em>
              </h1>
              <p>
                Plan, track, and preserve your sacred pilgrimages across India. One
                shrine completed, a lifelong path of divine discovery ahead.
              </p>
              <div className="hero-actions">
                <a href="#circuits" className="primary-button hero-cta">
                  Explore My Journey <ArrowRight size={16} />
                </a>
                <div className="hero-meta">
                  <span>
                    <Check size={14} /> {journey.place} Visited
                  </span>
                  <span>
                    <CalendarDays size={14} /> {journey.completedAt}
                  </span>
                </div>
              </div>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="sun" />
              <div className="temple-silhouette">ॐ</div>
              <div className="mountain mountain-one" />
              <div className="mountain mountain-two" />
              <div className="art-caption">
                Tirumala
                <br />
                <span>6 July 2026</span>
              </div>
            </div>
          </section>

          {/* Devotional Strip */}
          <div className="devotional-strip">
            <span className="strip-line" />
            <span className="strip-mantra">श्री वेंकटेश्वराय नमः</span>
            <span className="strip-line" />
            <span className="strip-caption">A prayer for every mile</span>
          </div>

          {/* 2. My Pilgrimage Progress Overview */}
          <section className="section-block" id="my-journey">
            <div className="section-heading">
              <div>
                <span className="section-kicker">PROGRESS OVERVIEW</span>
                <h2>My Pilgrimage Journey</h2>
              </div>
              <span className="goal-total">
                {totalCompleted} of {totalLocations} Sacred Places Visited
              </span>
            </div>

            <div className="progress-card-grid">
              <div className="progress-summary-card">
                <ProgressRing value={overallPercentage} />
                <div className="progress-summary-text">
                  <h3>Overall Completion</h3>
                  <p>
                    {totalCompleted === 0
                      ? "Choose a pilgrimage circuit to begin your sacred path."
                      : `${totalCompleted} temple${totalCompleted > 1 ? "s" : ""} visited across ${
                          circuitGoals.filter((g) => g.completed > 0).length
                        } circuit${circuitGoals.filter((g) => g.completed > 0).length > 1 ? "s" : ""}.`}
                  </p>
                  <div className="stat-pills">
                    <span className="stat-pill completed">
                      <strong>{totalCompleted}</strong> Visited
                    </span>
                    <span className="stat-pill remaining">
                      <strong>{totalLocations - totalCompleted}</strong> Remaining
                    </span>
                  </div>
                </div>
              </div>

              <div className="circuit-quick-list">
                {circuitGoals.map((goal) => {
                  const percent = Math.round((goal.completed / goal.total) * 100);
                  const isDone = goal.completed === goal.total;
                  return (
                    <div className="circuit-quick-item" key={goal.id}>
                      <div className="circuit-quick-header">
                        <div className="circuit-quick-title">
                          <span className={`goal-dot ${goal.accent}`} />
                          <strong>{goal.name}</strong>
                        </div>
                        <div className="circuit-quick-status">
                          <span>
                            {goal.completed} / {goal.total}
                          </span>
                          {isDone ? (
                            <span className="badge badge-done">Completed</span>
                          ) : goal.completed > 0 ? (
                            <span className="badge badge-progress">{percent}%</span>
                          ) : (
                            <span className="badge badge-pending">Not Started</span>
                          )}
                        </div>
                      </div>
                      <div className="bar">
                        <i
                          className={goal.accent}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 3. Pilgrimage Circuits Grid */}
          <section className="section-block" id="circuits">
            <div className="section-heading">
              <div>
                <span className="section-kicker">SACRED CIRCUITS</span>
                <h2>Pilgrimage Circuits</h2>
              </div>
              <span className="goal-total">
                5 Major Circuits Available
              </span>
            </div>

            <div className="circuits-grid">
              {circuits.map((circuit) => {
                const visitedCount = circuit.locations.filter((l) => l.visited).length;
                const totalCount = circuit.locations.length;
                const percent = Math.round((visitedCount / totalCount) * 100);
                const isComplete = visitedCount === totalCount;

                return (
                  <article
                    className="circuit-card"
                    key={circuit.id}
                    onClick={() => {
                      setSelectedCircuit(circuit);
                      setLocationFilter("all");
                    }}
                  >
                    <div className="circuit-card-header">
                      <div className="circuit-badge-wrap">
                        <span className={`goal-dot ${circuit.accent}`} />
                        <span className="circuit-badge-text">
                          {totalCount} Sacred Shrines
                        </span>
                      </div>
                      {isComplete ? (
                        <span className="status-chip complete">
                          <Check size={12} /> Completed
                        </span>
                      ) : visitedCount > 0 ? (
                        <span className="status-chip in-progress">
                          {visitedCount}/{totalCount} Visited
                        </span>
                      ) : (
                        <span className="status-chip not-started">
                          0/{totalCount} Visited
                        </span>
                      )}
                    </div>

                    <h3 className="circuit-name">{circuit.name}</h3>
                    <p className="circuit-subtitle">{circuit.subtitle}</p>

                    <div className="circuit-progress-wrap">
                      <div className="circuit-progress-info">
                        <span>Progress</span>
                        <strong>{percent}%</strong>
                      </div>
                      <div className="bar">
                        <i
                          className={circuit.accent}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <div className="circuit-card-footer">
                      <span className="circuit-remaining">
                        {totalCount - visitedCount === 0
                          ? "Circuit Complete"
                          : `${totalCount - visitedCount} destinations remaining`}
                      </span>
                      <button
                        className="explore-link"
                        aria-label={`View details for ${circuit.name}`}
                      >
                        Explore Circuit <ChevronRight size={15} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* 4. Up Next / Plan Ahead Destination */}
          <section className="next-card" id="next-plan">
            <div className="next-icon">
              <MapPin size={22} />
            </div>
            <div className="next-copy">
              <span className="section-kicker">UP NEXT DESTINATION</span>
              <h2>{journey.nextPlan}</h2>
              <p>{journey.nextPlanNote}</p>
            </div>
            <button
              className="primary-button"
              onClick={() => {
                setSaved(false);
                setShowPlan(true);
              }}
            >
              Plan this visit <ArrowUpRight size={16} />
            </button>
          </section>

          {saved && (
            <div className="save-note" role="status">
              <Check size={16} /> Your next destination plan has been saved
              successfully.
            </div>
          )}

          {/* 5. Sacred Memories / Photo Journal */}
          <section className="memories-section" id="memories">
            <div className="section-heading">
              <div>
                <span className="section-kicker">SACRED MEMORIES</span>
                <h2>Pilgrimage Journal &amp; Photos</h2>
              </div>
              <label className="upload-button">
                <ImagePlus size={16} /> Add Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={addPhotos}
                />
              </label>
            </div>

            <div className="memories-layout">
              <div className="photo-gallery-wrap">
                {photos.length === 0 ? (
                  <div className="empty-memories">
                    <Camera size={32} />
                    <h4>No memories uploaded yet</h4>
                    <p>
                      Upload photographs of your pilgrimages to keep sacred
                      moments close to your heart.
                    </p>
                    <label className="primary-button compact-btn">
                      <Plus size={15} /> Upload First Photo
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={addPhotos}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="photo-grid-compact">
                    {photos.map((photo) => (
                      <figure className="photo-item" key={photo.id}>
                        <img
                          src={photo.url}
                          alt={photo.caption || photo.name}
                          loading="lazy"
                        />
                        <button
                          className="photo-delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePhoto(photo.id);
                          }}
                          aria-label={`Remove photo ${photo.name}`}
                        >
                          <Trash2 size={13} />
                        </button>
                        <figcaption>
                          <span>{photo.caption}</span>
                          <small>{photo.name}</small>
                        </figcaption>
                      </figure>
                    ))}
                    <label className="photo-add-card">
                      <Camera size={20} />
                      <strong>Add Memory</strong>
                      <span>Upload photos</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={addPhotos}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Visited Place Highlight */}
              <article className="place-spotlight-card">
                <div className="spotlight-header">
                  <div className="detail-icon">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <span className="section-kicker">FIRST VISITED SHRINE</span>
                    <h3>{journey.place}</h3>
                  </div>
                </div>

                <div className="detail-date">
                  <CalendarDays size={14} /> Completed on {journey.completedAt}
                </div>

                <p className="spotlight-text">
                  Tirumala marked the serene beginning of Raj&apos;s sacred journey.
                  The holy seven hills and the darshan established the spiritual
                  foundation for the pilgrimages to come.
                </p>

                <div className="detail-divider" />
                <span className="detail-label">PERSONAL REFLECTION</span>
                <p className="personal-note">
                  “A peaceful beginning. The path is open and filled with grace.”
                </p>
              </article>
            </div>
          </section>

          {/* 6. Story & Timeline (100% Spiritual, No Career Clutter) */}
          <section className="timeline-section" id="story">
            <div className="section-heading">
              <div>
                <span className="section-kicker">PILGRIMAGE TIMELINE</span>
                <h2>Your Spiritual Journey So Far</h2>
              </div>
            </div>

            <div className="timeline-compact">
              <div className="timeline-spine" />

              {/* Milestone 1: Tirumala */}
              <div className="timeline-card done">
                <div className="timeline-marker done">
                  <Check size={14} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-header-row">
                    <span className="timeline-date">6 JULY 2026</span>
                    <span className="completed-tag">Completed</span>
                  </div>
                  <h3>Tirumala (Tirupati)</h3>
                  <p>
                    The first recorded holy pilgrimage. Dedicated to Lord Sri
                    Venkateswara, laying the foundation toward completing the 12
                    Jyotirlingas, Panch Kedar, Char Dham, and Panch Kailash.
                  </p>
                </div>
              </div>

              {/* Milestone 2: Next Planned Stop */}
              <div className="timeline-card upcoming">
                <div className="timeline-marker upcoming">
                  <MapPin size={14} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-header-row">
                    <span className="timeline-date">NEXT DESTINATION</span>
                    <span className="upcoming-tag">In Planning</span>
                  </div>
                  <h3>{journey.nextPlan}</h3>
                  <p>
                    {journey.nextPlanNote ||
                      "Plan the dates, route, and accommodations for your next sacred visit."}
                  </p>
                  <button
                    className="text-button"
                    onClick={() => setShowPlan(true)}
                  >
                    Edit destination details <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer>
            <span>Made with devotion for the road ahead, {journey.name}.</span>
            <span>
              12 Jyotirlingas <b>·</b> Panch Kedar <b>·</b> Char Dham <b>·</b> Panch
              Kailash <b>·</b> Tirumala
            </span>
          </footer>
        </div>
      </main>

      {/* Plan Destination Modal */}
      {showPlan && (
        <div className="modal-backdrop" onClick={() => setShowPlan(false)}>
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="close-button"
              onClick={() => setShowPlan(false)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <span className="section-kicker">NEXT SACRED DESTINATION</span>
            <h2 id="plan-modal-title">Plan Your Next Visit</h2>
            <p>
              Set your upcoming pilgrimage destination and add any travel notes or
              preparations.
            </p>
            <form onSubmit={savePlan}>
              <label>
                Destination Name
                <input
                  name="nextPlan"
                  defaultValue={journey.nextPlan}
                  required
                  placeholder="e.g. Srisailam, Kedarnath, Somnath"
                />
              </label>
              <label>
                Notes &amp; Travel Plan
                <input
                  name="note"
                  defaultValue={journey.nextPlanNote}
                  placeholder="e.g. Planning a weekend trip via Hyderabad"
                />
              </label>
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowPlan(false)}
                >
                  Cancel
                </button>
                <button className="primary-button" type="submit">
                  Save Next Plan <Check size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Circuit Detail Explorer Modal */}
      {selectedCircuit && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedCircuit(null)}
        >
          <div
            className="circuit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="circuit-detail-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="circuit-modal-header">
              <div>
                <div className="circuit-modal-badge">
                  <span className={`goal-dot ${selectedCircuit.accent}`} />
                  <span className="section-kicker">CIRCUIT EXPLORER</span>
                </div>
                <h2 id="circuit-detail-title">{selectedCircuit.name}</h2>
                <p className="circuit-modal-desc">
                  {selectedCircuit.description}
                </p>
              </div>
              <button
                type="button"
                className="close-button"
                onClick={() => setSelectedCircuit(null)}
                aria-label="Close circuit details"
              >
                <X size={20} />
              </button>
            </div>

            {/* Circuit Progress Bar inside modal */}
            <div className="modal-progress-strip">
              <div className="modal-progress-label">
                <span>
                  <strong>
                    {
                      selectedCircuit.locations.filter((l) => l.visited).length
                    }
                  </strong>{" "}
                  of <strong>{selectedCircuit.locations.length}</strong> visited
                </span>
                <span className="modal-percent">
                  {Math.round(
                    (selectedCircuit.locations.filter((l) => l.visited).length /
                      selectedCircuit.locations.length) *
                      100
                  )}
                  % Complete
                </span>
              </div>
              <div className="bar">
                <i
                  className={selectedCircuit.accent}
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

            {/* Filter Pills */}
            <div className="modal-filter-row">
              <span className="filter-label">Filter:</span>
              <button
                className={`filter-pill ${locationFilter === "all" ? "active" : ""}`}
                onClick={() => setLocationFilter("all")}
              >
                All ({selectedCircuit.locations.length})
              </button>
              <button
                className={`filter-pill ${locationFilter === "visited" ? "active" : ""}`}
                onClick={() => setLocationFilter("visited")}
              >
                Visited (
                {selectedCircuit.locations.filter((l) => l.visited).length})
              </button>
              <button
                className={`filter-pill ${locationFilter === "pending" ? "active" : ""}`}
                onClick={() => setLocationFilter("pending")}
              >
                To Visit (
                {selectedCircuit.locations.filter((l) => !l.visited).length})
              </button>
            </div>

            {/* Locations List */}
            <div className="circuit-locations-list">
              {selectedCircuit.locations
                .filter((loc) => {
                  if (locationFilter === "visited") return loc.visited;
                  if (locationFilter === "pending") return !loc.visited;
                  return true;
                })
                .map((loc, idx) => (
                  <div
                    className={`location-card ${loc.visited ? "is-visited" : ""}`}
                    key={loc.id}
                  >
                    <div className="location-img-wrap">
                      <img
                        src={loc.imageUrl}
                        alt={loc.name}
                        loading="lazy"
                        onError={(e) => {
                          // Fallback placeholder image if Unsplash link breaks
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80";
                        }}
                      />
                      <span className="location-index">#{idx + 1}</span>
                    </div>

                    <div className="location-content">
                      <div className="location-title-row">
                        <h4>{loc.name}</h4>
                        <span className="location-state">
                          <MapPin size={12} /> {loc.state}
                        </span>
                      </div>

                      {loc.deity && (
                        <p className="location-deity">
                          <strong>Deity:</strong> {loc.deity}
                        </p>
                      )}

                      <p className="location-desc">{loc.description}</p>

                      {loc.visited && loc.visitedDate && (
                        <div className="location-visited-date">
                          <Check size={13} /> Visited on {loc.visitedDate}
                        </div>
                      )}

                      {loc.notes && (
                        <div className="location-note-preview">
                          <Info size={12} /> {loc.notes}
                        </div>
                      )}

                      <button
                        className={`toggle-visit-btn ${
                          loc.visited ? "marked-done" : "mark-pending"
                        }`}
                        onClick={() =>
                          toggleLocationVisited(selectedCircuit.id, loc.id)
                        }
                      >
                        {loc.visited ? (
                          <>
                            <Check size={14} /> Visited
                          </>
                        ) : (
                          <>
                            <Plus size={14} /> Mark as Visited
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="circuit-modal-footer">
              <button
                className="secondary-button"
                onClick={() => setSelectedCircuit(null)}
              >
                Close Explorer
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="loading-bar" />}
    </div>
  );
}

export default App;

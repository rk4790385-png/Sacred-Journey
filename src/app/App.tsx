import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, BookOpen, CalendarDays, Camera, Check, Compass, Flame, Heart, ImagePlus, MapPin, Menu, Plus, Route, Sparkles, Target, X } from "lucide-react";

type Goal = { name: string; completed: number; total: number; accent: string };
type Journey = { name: string; completedAt: string; place: string; nextPlan: string; nextPlanNote: string; goals: Goal[] };
type MemoryPhoto = { id: string; name: string; url: string; caption: string };

const fallbackJourney: Journey = {
  name: "Raj", completedAt: "6 July 2026", place: "Tirumala (Tirupati)", nextPlan: "Srisailam", nextPlanNote: "Next destination to plan",
  goals: [
    { name: "12 Jyotirlingas", completed: 0, total: 12, accent: "saffron" },
    { name: "Panch Kedar", completed: 0, total: 5, accent: "forest" },
    { name: "Char Dham", completed: 0, total: 4, accent: "sky" },
    { name: "Panch Kailash", completed: 0, total: 5, accent: "plum" },
    { name: "Tirumala (Tirupati)", completed: 1, total: 1, accent: "gold" },
  ],
};
const API_URL = `${import.meta.env.VITE_API_URL || ""}/api/journey`;
const DEFAULT_PHOTO: MemoryPhoto = { id: "tirumala-memory", name: "Tirumala sunrise", url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=82", caption: "A quiet morning at Tirumala" };

function ProgressRing({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 52;
  return <div className="ring" style={{ "--progress": `${(value / 100) * circumference}px` } as React.CSSProperties}>
    <svg viewBox="0 0 120 120" aria-label={`${value}% complete`}><circle className="ring-track" cx="60" cy="60" r="52" /><circle className="ring-value" cx="60" cy="60" r="52" /></svg>
    <div className="ring-label"><strong>{value}%</strong><span>complete</span></div>
  </div>;
}

function App() {
  const [journey, setJourney] = useState<Journey>(fallbackJourney);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [saved, setSaved] = useState(false);
  const [photos, setPhotos] = useState<MemoryPhoto[]>(() => {
    try { return JSON.parse(localStorage.getItem("sacred-journey-photos") || "null") || [DEFAULT_PHOTO]; } catch { return [DEFAULT_PHOTO]; }
  });
  useEffect(() => {
    fetch(API_URL).then((response) => response.ok ? response.json() : Promise.reject()).then((data: Journey) => setJourney(data)).catch(() => undefined).finally(() => setLoading(false));
  }, []);
  const completed = useMemo(() => journey.goals.reduce((sum, goal) => sum + goal.completed, 0), [journey]);
  const total = useMemo(() => journey.goals.reduce((sum, goal) => sum + goal.total, 0), [journey]);
  const percentage = Math.round((completed / total) * 100);
  useEffect(() => { localStorage.setItem("sacred-journey-photos", JSON.stringify(photos)); }, [photos]);
  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((current) => [...current, { id: `${file.name}-${file.lastModified}`, name: file.name, url: String(reader.result), caption: "A memory from Raj's journey" }]);
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  }
  async function savePlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextPlan = String(form.get("nextPlan") || "Srisailam");
    const nextPlanNote = String(form.get("note") || "Next destination to plan");
    setJourney({ ...journey, nextPlan, nextPlanNote }); setSaved(true); setShowPlan(false);
    try { await fetch(`${API_URL}/plan`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nextPlan, nextPlanNote }) }); } catch { /* Keep the local dashboard usable when the API is offline. */ }
  }
  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? "is-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Sparkles size={18} /></div><span>Sacred<span>Journey</span></span></div>
      <div className="profile-chip"><div className="avatar">R</div><div><strong>Raj</strong><small>My sacred path</small></div></div>
      <nav><p className="nav-label">Your journey</p><a className="nav-item active" href="#overview"><Compass size={17} /> Overview</a><a className="nav-item" href="#goals"><Target size={17} /> Goals <span className="nav-count">5</span></a><a className="nav-item" href="#memories"><Camera size={17} /> Memories</a><a className="nav-item" href="#timeline"><Route size={17} /> Timeline</a><a className="nav-item" href="#next"><CalendarDays size={17} /> Next plan</a></nav>
      <div className="sidebar-quote"><Heart size={15} fill="currentColor" /><p>“The journey itself is the prayer.”</p></div><div className="sidebar-footer">Sacred Journey <span>v1.0</span></div>
    </aside>
    {menuOpen && <button className="mobile-scrim" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}
    <main className="main-content">
      <header className="topbar"><button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={21} /></button><div className="eyebrow">PERSONAL PILGRIMAGE TRACKER</div><div className="topbar-right"><span className="live-dot" /> Saved locally for Raj <div className="avatar small">R</div></div></header>
      <div className="content-wrap">
        <section className="hero" id="overview"><div className="hero-copy"><div className="kicker"><Flame size={14} /> A path of devotion</div><h1>Keep walking,<br /><em>Raj.</em></h1><p>Your pilgrimage has begun. One temple completed, a lifetime of sacred places ahead.</p><div className="hero-meta"><span><Check size={14} /> Tirupati completed</span><span><CalendarDays size={14} /> {journey.completedAt}</span></div></div><div className="hero-art"><div className="sun" /><div className="temple-silhouette">ॐ</div><div className="mountain mountain-one" /><div className="mountain mountain-two" /><div className="art-caption">Tirumala<br /><span>6 July 2026</span></div></div></section>
        <div className="devotional-strip"><span className="strip-line" /><span className="strip-mantra">श्री वेंकटेश्वराय नमः</span><span className="strip-line" /><span className="strip-caption">A prayer for every mile</span></div>
        <section className="next-card" id="next"><div className="next-icon"><MapPin size={21} /></div><div className="next-copy"><span className="section-kicker">UP NEXT</span><h2>{journey.nextPlan}</h2><p>{journey.nextPlanNote}</p></div><button className="primary-button" onClick={() => { setSaved(false); setShowPlan(true); }}>Plan this visit <ArrowUpRight size={16} /></button></section>
        {saved && <div className="save-note"><Check size={15} /> Your next plan has been saved.</div>}
        <section className="memories-section" id="memories"><div className="section-heading"><div><span className="section-kicker">SACRED MEMORIES</span><h2>Keep the moments close</h2></div><label className="upload-button"><ImagePlus size={16} /> Add photos<input type="file" accept="image/*" multiple onChange={addPhotos} /></label></div><div className="memories-layout"><div className="photo-wall">{photos.map((photo, index) => <figure className={`photo-card photo-${index % 3}`} key={photo.id}><img src={photo.url} alt={photo.caption} /><figcaption><span>{photo.caption}</span><small>{photo.name}</small></figcaption></figure>)}<label className="photo-add"><Camera size={22} /><strong>Upload a memory</strong><span>JPG, PNG or WEBP</span><input type="file" accept="image/*" multiple onChange={addPhotos} /></label></div><article className="place-detail glass-panel"><div className="detail-icon"><BookOpen size={19} /></div><span className="section-kicker">VISITED PLACE</span><h3>Tirumala (Tirupati)</h3><div className="detail-date"><CalendarDays size={14} /> 6 July 2026</div><p>Tirumala was the first step in Raj's sacred journey. The hills, the quiet devotion, and the darshan created a beginning worth carrying into every destination ahead.</p><div className="detail-divider" /><span className="detail-label">PERSONAL NOTE</span><p className="personal-note">“A peaceful beginning. The path is open.”</p></article></div></section>
        <section className="section-block" id="goals"><div className="section-heading"><div><span className="section-kicker">THE BIG PICTURE</span><h2>Your sacred goals</h2></div><span className="goal-total">{completed} of {total} places completed</span></div><div className="goal-layout"><div className="progress-panel"><ProgressRing value={percentage} /><div className="progress-text"><strong>Every destination<br />has a story.</strong><p>Stay present for each step. Your goals are yours to complete in your own time.</p></div></div><div className="goal-list">{journey.goals.map((goal) => <div className="goal-row" key={goal.name}><div className={`goal-dot ${goal.accent}`} /><div className="goal-info"><div><strong>{goal.name}</strong><span>{goal.completed}/{goal.total}</span></div><div className="bar"><i className={goal.accent} style={{ width: `${(goal.completed / goal.total) * 100}%` }} /></div></div>{goal.completed === goal.total ? <Check className="done-check" size={17} /> : <span className="remaining">{goal.total - goal.completed} left</span>}</div>)}</div></div></section>
        <section className="timeline-section" id="timeline"><div className="section-heading"><div><span className="section-kicker">YOUR STORY SO FAR</span><h2>A beginning worth remembering</h2></div></div><div className="timeline"><div className="timeline-line" /><div className="timeline-item"><div className="timeline-pin done"><Check size={14} /></div><div><span className="timeline-date">6 JULY 2026</span><h3>Tirumala (Tirupati)</h3><p>Your first recorded destination. A beautiful beginning to the path toward 12 Jyotirlingas, Panch Kedar, Char Dham, Panch Kailash and Tirumala.</p><span className="completed-tag">Completed</span></div></div><div className="timeline-item upcoming"><div className="timeline-pin"><MapPin size={14} /></div><div><span className="timeline-date">NEXT DESTINATION</span><h3>{journey.nextPlan}</h3><p>Choose a date, make a plan, and let the next chapter find its way to you.</p><button className="text-button" onClick={() => setShowPlan(true)}>Add details <Plus size={14} /></button></div></div></div></section>
        <footer><span>Made for the road ahead, Raj.</span><span>12 Jyotirlingas <b>·</b> Panch Kedar <b>·</b> Char Dham <b>·</b> Panch Kailash <b>·</b> Tirumala</span></footer>
      </div>
    </main>
    {showPlan && <div className="modal-backdrop" onClick={() => setShowPlan(false)}><form className="plan-modal" onSubmit={savePlan} onClick={(event) => event.stopPropagation()}><button type="button" className="close-button" onClick={() => setShowPlan(false)} aria-label="Close"><X size={18} /></button><span className="section-kicker">NEXT CHAPTER</span><h2>Plan your next visit</h2><p>Keep Srisailam as your next destination, or name another sacred place.</p><label>Destination<input name="nextPlan" defaultValue={journey.nextPlan} required /></label><label>Note<input name="note" defaultValue={journey.nextPlanNote} /></label><button className="primary-button" type="submit">Save next plan <Check size={16} /></button></form></div>}
    {loading && <div className="loading-bar" />}
  </div>;
}
export default App;

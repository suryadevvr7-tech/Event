import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard.jsx';

export default function Dashboard({ eventCatalog, loadingEvents, eventsError, refreshEvents, deleteEvent }) {
  return <main className="page-shell">
    <section className="dashboard-heading">
      <h1>Event Dashboard</h1>
      <Link className="button button-primary" to="/add-event">＋ <span>Add Event</span></Link>
    </section>
    <section className="events-section" aria-label="Event list">
      <div className="section-heading"><h2>Events</h2></div>
      {eventsError && <div className="notice notice-error"><span>{eventsError} Check the API and backend/.env.</span><button className="retry-button" onClick={refreshEvents}>Retry</button></div>}
      {loadingEvents ? <div className="loading-state"><span className="loading-spinner" />Loading events…</div> : eventCatalog.length === 0 ? <div className="empty-panel"><span className="empty-mark">＋</span><h3>No events yet</h3><Link className="button button-primary" to="/add-event">Add Event</Link></div> : <div className="event-grid">{[...eventCatalog].sort((firstEntry, secondEntry) => new Date(firstEntry.date) - new Date(secondEntry.date)).map((eventEntry) => <EventCard key={eventEntry._id} eventEntry={eventEntry} onDelete={deleteEvent} />)}</div>}
    </section>
  </main>;
}

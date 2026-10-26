import { Link } from 'react-router-dom';

const presentDate = (dateValue) => {
  if (!dateValue) return 'Not set';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${String(dateValue).slice(0, 10)}T12:00:00`));
};

export default function EventCard({ eventEntry, onDelete }) {
  return <article className="event-card">
    <div className="event-card-top"><span className="event-id-tag">ID · {eventEntry._id}</span><span className="event-dot" /></div>
    <h2>{eventEntry.name}</h2>
    <div className="event-facts">
      <div><span>Event Date</span><strong>{presentDate(eventEntry.date)}</strong></div>
      <div><span>Venue</span><strong>{eventEntry.venue}</strong></div>
      <div><span>Total Registrations</span><strong className="registration-value">{Number(eventEntry.totalRegistrations || 0).toLocaleString()}</strong></div>
    </div>
    <div className="card-actions">
      <Link className="card-action update-action" to={`/edit-event/${eventEntry._id}`}>Update</Link>
      <button className="card-action delete-action" type="button" onClick={() => onDelete(eventEntry)}>Delete</button>
    </div>
  </article>;
}

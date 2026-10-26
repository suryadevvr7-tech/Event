import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EventForm from './pages/EventForm.jsx';
import useEvents from './hooks/useEvents.js';
import './styles.css';

export default function App() {
  const { eventCatalog, loadingEvents, eventsError, refreshEvents, createEvent, updateEvent, deleteEvent } = useEvents();

  return <div className="app-frame">
    <Navbar />
    <Routes>
      <Route path="/" element={<Dashboard eventCatalog={eventCatalog} loadingEvents={loadingEvents} eventsError={eventsError} refreshEvents={refreshEvents} deleteEvent={deleteEvent} />} />
      <Route path="/add-event" element={<EventForm eventCatalog={eventCatalog} loadingEvents={loadingEvents} eventsError={eventsError} createEvent={createEvent} updateEvent={updateEvent} />} />
      <Route path="/edit-event/:id" element={<EventForm eventCatalog={eventCatalog} loadingEvents={loadingEvents} eventsError={eventsError} createEvent={createEvent} updateEvent={updateEvent} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </div>;
}

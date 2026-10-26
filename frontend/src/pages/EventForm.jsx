import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const blankForm = { name: '', description: '', date: '', venue: '' };
const inputDate = (dateValue) => dateValue ? new Date(dateValue).toISOString().slice(0, 10) : '';

export default function EventForm({ eventCatalog, loadingEvents, eventsError, createEvent, updateEvent }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(id);
  const currentEntry = eventCatalog.find((eventEntry) => eventEntry._id === id);
  const [formState, setFormState] = useState(blankForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (currentEntry) {
      setFormState({ name: currentEntry.name || '', description: currentEntry.description || '', date: inputDate(currentEntry.date), venue: currentEntry.venue || '' });
    } else if (!editing) {
      setFormState(blankForm);
    }
  }, [currentEntry, editing]);

  const updateField = (fieldName) => (inputEvent) => setFormState((currentForm) => ({ ...currentForm, [fieldName]: inputEvent.target.value }));

  const submitForm = async (submitEvent) => {
    submitEvent.preventDefault();
    setSaving(true);
    setFormError('');
    const eventPayload = { name: formState.name.trim(), description: formState.description.trim(), date: formState.date, venue: formState.venue.trim() };
    try {
      if (editing) await updateEvent(id, eventPayload);
      else await createEvent(eventPayload);
      navigate('/');
    } catch (failureObject) {
      setFormError(failureObject.message || 'Could not save this event.');
    } finally {
      setSaving(false);
    }
  };

  if (editing && loadingEvents && !currentEntry) return <main className="page-shell"><p>Loading event…</p></main>;
  if (editing && !currentEntry) return <main className="page-shell"><div className="notice notice-error">{eventsError || 'Event not found.'} <Link to="/">Back to Dashboard</Link></div></main>;

  return <main className="page-shell form-page">
    <section className="form-card">
      <h1>{editing ? 'Update Event' : 'Add Event'}</h1>
      {formError && <div className="notice notice-error">{formError}</div>}
      <form className="event-form" onSubmit={submitForm}>
        <label className="field-label">Event Name<input autoComplete="off" maxLength="100" name="name" required value={formState.name} onChange={updateField('name')} /></label>
        <label className="field-label">Event Description<textarea maxLength="2000" name="description" required rows="4" value={formState.description} onChange={updateField('description')} /></label>
        <label className="field-label">Event Date<input name="date" type="date" required value={formState.date} onChange={updateField('date')} /></label>
        <label className="field-label">Venue<input autoComplete="off" maxLength="160" name="venue" required value={formState.venue} onChange={updateField('venue')} /></label>
        <div className="form-actions"><Link className="button button-secondary" to="/">Cancel</Link><button className="button button-primary" disabled={saving} type="submit">{saving ? 'Saving…' : editing ? 'Update Event' : 'Save Event'}</button></div>
      </form>
    </section>
  </main>;
}

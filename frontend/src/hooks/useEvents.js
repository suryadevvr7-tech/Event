import { useCallback, useEffect, useState } from 'react';

const eventsEndpoint = 'http://localhost:5000/api/events';

const normalizeEvent = (eventEntry) => ({
  ...eventEntry,
  date: eventEntry.date || eventEntry.eventDate || ''
});

const toBackendPayload = ({ date, ...eventPayload }) => ({
  ...eventPayload,
  eventDate: date
});

const sendJson = async (resourcePath, requestOptions = {}) => {
  const responsePacket = await fetch(resourcePath, {
    ...requestOptions,
    headers: { 'Content-Type': 'application/json', ...requestOptions.headers }
  });
  if (!responsePacket.ok) {
    const failurePacket = await responsePacket.json().catch(() => ({}));
    throw new Error(failurePacket.message || 'The request could not be completed.');
  }
  return responsePacket.status === 204 ? null : responsePacket.json();
};

export default function useEvents() {
  const [eventCatalog, setEventCatalog] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState('');

  const refreshEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const responseCatalog = await sendJson(eventsEndpoint);
      setEventCatalog(responseCatalog.map(normalizeEvent));
      setEventsError('');
    } catch (failureObject) {
      setEventsError(failureObject.message || 'Could not load events.');
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  const createEvent = useCallback(async (eventPayload) => {
    const savedEntry = await sendJson(eventsEndpoint, {
      method: 'POST',
      body: JSON.stringify(toBackendPayload(eventPayload))
    });
    await refreshEvents();
    return normalizeEvent(savedEntry);
  }, [refreshEvents]);

  const updateEvent = useCallback(async (eventId, eventPayload) => {
    const savedEntry = await sendJson(`${eventsEndpoint}/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(toBackendPayload(eventPayload))
    });
    await refreshEvents();
    return normalizeEvent(savedEntry);
  }, [refreshEvents]);

  const deleteEvent = useCallback(async (eventEntry) => {
    const confirmedRemoval = window.confirm(`Delete ${eventEntry.name}? This cannot be undone.`);
    if (!confirmedRemoval) return;
    await sendJson(`${eventsEndpoint}/${eventEntry._id}`, { method: 'DELETE' });
    setEventCatalog((currentCatalog) => currentCatalog.filter((savedEntry) => savedEntry._id !== eventEntry._id));
  }, []);

  return { eventCatalog, loadingEvents, eventsError, refreshEvents, createEvent, updateEvent, deleteEvent };
}

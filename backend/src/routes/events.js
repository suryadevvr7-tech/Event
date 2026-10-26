import { Router } from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event.js';

const eventRouter = Router();
const editableFields = ['name', 'description', 'eventDate', 'venue'];

const validateEventFields = (payloadPacket, partialUpdate = false) => {
  if (!payloadPacket || typeof payloadPacket !== 'object' || Array.isArray(payloadPacket)) {
    const failureObject = new Error('Request body must be a JSON object.');
    failureObject.status = 400;
    throw failureObject;
  }
  const acceptedFields = {};
  for (const fieldName of editableFields) {
    if (Object.hasOwn(payloadPacket, fieldName)) acceptedFields[fieldName] = payloadPacket[fieldName];
  }
  if (!partialUpdate && editableFields.some((fieldName) => !Object.hasOwn(acceptedFields, fieldName))) {
    const failureObject = new Error('Name, description, event date, and venue are required.');
    failureObject.status = 400;
    throw failureObject;
  }
  if (acceptedFields.eventDate && Number.isNaN(new Date(acceptedFields.eventDate).getTime())) {
    const failureObject = new Error('Enter a valid event date.');
    failureObject.status = 400;
    throw failureObject;
  }
  return acceptedFields;
};

eventRouter.get('/', async (_requestContext, responseContext, nextHandler) => {
  try {
    const eventCatalog = await Event.find().sort({ eventDate: 1, createdAt: -1 }).lean();
    responseContext.json(eventCatalog);
  } catch (failureObject) {
    nextHandler(failureObject);
  }
});

eventRouter.post('/', async (requestContext, responseContext, nextHandler) => {
  try {
    const eventEntry = await Event.create(validateEventFields(requestContext.body));
    responseContext.status(201).json(eventEntry);
  } catch (failureObject) {
    if (failureObject.name === 'ValidationError') failureObject.status = 400;
    nextHandler(failureObject);
  }
});

eventRouter.put('/:eventId', async (requestContext, responseContext, nextHandler) => {
  try {
    if (!mongoose.isValidObjectId(requestContext.params.eventId)) {
      return responseContext.status(400).json({ message: 'Invalid event ID.' });
    }
    const changeset = validateEventFields(requestContext.body, true);
    const revisedEntry = await Event.findByIdAndUpdate(requestContext.params.eventId, changeset, {
      new: true,
      runValidators: true
    });
    if (!revisedEntry) return responseContext.status(404).json({ message: 'Event not found.' });
    responseContext.json(revisedEntry);
  } catch (failureObject) {
    if (failureObject.name === 'ValidationError') failureObject.status = 400;
    nextHandler(failureObject);
  }
});

eventRouter.delete('/:eventId', async (requestContext, responseContext, nextHandler) => {
  try {
    if (!mongoose.isValidObjectId(requestContext.params.eventId)) {
      return responseContext.status(400).json({ message: 'Invalid event ID.' });
    }
    const removedEntry = await Event.findByIdAndDelete(requestContext.params.eventId);
    if (!removedEntry) return responseContext.status(404).json({ message: 'Event not found.' });
    responseContext.status(204).end();
  } catch (failureObject) {
    nextHandler(failureObject);
  }
});

export default eventRouter;

import dns from 'node:dns';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import eventRouter from './routes/events.js';

dotenv.config();

const application = express();
const servicePort = Number(process.env.PORT) || 5000;
const databaseAddress = process.env.MONGODB_URI;
const dnsResolvers = process.env.DNS_SERVERS?.split(',').map((serverAddress) => serverAddress.trim()).filter(Boolean);

if (dnsResolvers?.length) dns.setServers(dnsResolvers);

application.use(cors({ origin: [process.env.CLIENT_ORIGIN || 'http://localhost:5173', 'http://localhost:5174'] }));
application.use(express.json({ limit: '20kb' }));
application.get('/api/health', (_requestContext, responseContext) => {
  responseContext.json({ status: 'ok' });
});
application.use('/api/events', eventRouter);
application.use((failureObject, _requestContext, responseContext, _nextHandler) => {
  const httpStatus = failureObject.status || 500;
  responseContext.status(httpStatus).json({ message: failureObject.message || 'Unexpected server error.' });
});

if (!databaseAddress) {
  console.error('MONGODB_URI is required. Copy backend/.env.example to backend/.env and set your database URI.');
  process.exit(1);
}

mongoose.connect(databaseAddress)
  .then(() => {
    application.listen(servicePort, () => console.log(`Event API listening on port ${servicePort}`));
  })
  .catch((failureObject) => {
    console.error('Database connection failed:', failureObject.message);
    process.exit(1);
  });

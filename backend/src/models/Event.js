import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  eventDate: { type: Date, required: true },
  venue: { type: String, required: true, trim: true, maxlength: 160 },
  totalRegistrations: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);

import mongoose, { Schema, type Document } from 'mongoose';

export type HolidayType = 'inamovible' | 'trasladable' | 'nolaborable' | 'puente';

export interface IHoliday extends Document {
  date: string; // YYYY-MM-DD
  year: number;
  name: string;
  type: HolidayType;
  info?: string;
}

const HolidaySchema = new Schema<IHoliday>(
  {
    date: { type: String, required: true, index: true },
    year: { type: Number, required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['inamovible', 'trasladable', 'nolaborable', 'puente'],
      required: true,
    },
    info: { type: String },
  },
  { timestamps: true }
);

HolidaySchema.index({ year: 1, date: 1 }, { unique: true });

export const HolidayModel = mongoose.model<IHoliday>('Holiday', HolidaySchema);
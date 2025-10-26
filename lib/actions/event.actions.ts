'use server';

import Event from '@/database/event.model';
import connectDB from "@/lib/mongodb";
import { Types } from 'mongoose';

// Create a proper lean event interface that matches Mongoose's lean output
export interface ILeanEvent {
    _id: Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export const getSimilarEventsBySlug = async (slug: string): Promise<ILeanEvent[]> => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug });

        if (!event) {
            return [];
        }

        // Use proper typing for the lean query
        const similarEvents = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags }
        }).lean<ILeanEvent[]>().exec();

        return similarEvents;
    } catch {
        return [];
    }
}
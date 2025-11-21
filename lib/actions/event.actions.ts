'use server';

import { Event } from "@/database";
import { connectToDatabase } from "../mongodb";
import { IEvent } from "@/database/event.model";


export const getSimilarEventsBySlug=async(slug:string)=>{
    try {
        await connectToDatabase();
        const event =await Event.findOne({slug})
        const events  =await Event.find({_id:{$ne:event?._id},tags:{$in:event?.tags}}).lean() ;
        return events;
    } catch (error) {
        return [];
    }

}
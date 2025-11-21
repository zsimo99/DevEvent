import { Event } from "@/database";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { json } from "stream/consumers";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const formData = await req.formData();
    console.log(formData);
    let event;
    try {
      event = Object.fromEntries(formData);
    } catch (error) {
      return NextResponse.json({ error: "invalid form data" }, { status: 400 });
    }
    const file = formData.get("image") as File ;

    if (!file)
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    event.tags=JSON.parse(formData.get("tags") as string)||[];
    event.agenda=JSON.parse(formData.get("agenda") as string)||[];

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, results) => {
            if (error) return reject(error);

            resolve(results);
          }
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;
    const createdEvent = await Event.create(event);
    return NextResponse.json(
      { message: "event created successfully", data: createdEvent },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error instanceof Error ? error?.message : "unknown error" },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json(
          { message: "events fetched successfully", data: events },
          { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error?.message : "unknown error",message:"failed to fetch events" },
          { status: 500 }
        );
    }
}
import { Event } from "@/database";
import { IEvent } from "@/database/event.model";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest,NextResponse } from "next/server";
type RouteParams={
    params:Promise<{slug:string}>;
}

export async function GET(req:NextRequest,{params}:RouteParams):Promise<NextResponse> {
    try {
        const {slug} = await params;
        console.log("slug:",slug);
        if(!slug||typeof slug!=="string" || slug.trim()===""){
            return NextResponse.json({message:"invalid slug"},{status:400});
        }
        await connectToDatabase();
        const event :IEvent | null = await Event.findOne({slug}) ;
        if(!event){
            return NextResponse.json({message:"event not found"},{status:404});
        }
        return NextResponse.json({message:"event fetched successfully",data:event},{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json(
          { error: error instanceof Error ? error?.message : "unknown error" },
          { status: 500 }
        );
    }
}
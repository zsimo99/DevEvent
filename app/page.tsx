import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";
import Image from "next/image";


export default function Home() {
  return (
    <section>
      <h1 className="text-center">
        The Hub For Every Dev <br /> Event You Mustn't Miss{" "}
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events.map((event,i) => (
            <li className="list-none" key={i}><EventCard {...event}/></li>
          ))}
        </ul>
      </div>
    </section>
  );
}

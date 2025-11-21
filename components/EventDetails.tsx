import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { cacheLife } from "next/cache";
import Image from "next/image";

const EventDetailsItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};
const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);
const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-2 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);

const EventDetails = async ({ params }: { params: Promise<string> }) => {
    "use cache";
      cacheLife("hours");
    
      const  slug  = await params;
  const {
    data: {
      _id,
      title,
      description,
      overview,
      image,
      venue,
      location,
      date,
      time,
      mode,
      audience,
      agenda,
      organizer,
      tags,
      createdAt,
      updatedAt,
    },
  }: { data: IEvent } = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`
  ).then((res) => res.json());

  const bookings = 10;

  const similarEvents: any = await getSimilarEventsBySlug(slug);
  // console.log("similarEvents::::::::::: /n",similarEvents);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>
      <div className="details">
        {/* left side */}
        <div className="content">
          <Image
            src={image}
            alt="event banner"
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col gap-2">
            <h2>Event details</h2>
            <EventDetailsItem label={date} alt="date" icon="/icons/calendar.svg" />
            <EventDetailsItem label={time} alt="time" icon="/icons/clock.svg" />
            <EventDetailsItem
              label={location}
              alt="location"
              icon="/icons/pin.svg"
            />
            <EventDetailsItem label={mode} alt="mode" icon="/icons/mode.svg" />
            <EventDetailsItem
              label={audience}
              alt="audience"
              icon="/icons/audience.svg"
            />
          </section>
          <EventAgenda agendaItems={agenda} />
          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tags={tags} />
        </div>
        {/* booking form */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {bookings > 0 ? (
              <p className="text-sm">
                Join {bookings} people who have already booked their spot!
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}

            <BookEvent eventId={_id.toString()} slug={slug} />
          </div>
        </aside>
      </div>
      <div style={{ flexDirection: "column" }} className="flex gap-4 mt-8">
        <h2>Similar Events You May Like</h2>
        <div className="events">
          {similarEvents.map((similarEvent: IEvent) => (
            <EventCard key={similarEvent._id.toString()} {...similarEvent} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;

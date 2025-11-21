import EventDetails from "@/components/EventDetails";
import { Suspense } from "react";



async function page({ params }: { params: Promise<{ slug: string }> }) {
  const slug=params.then(p=>p.slug);

  return(
    <main>
      <Suspense fallback={<div>...loading</div>}>
        <EventDetails params={slug} />
      </Suspense>
    </main>
  )
}

export default page;

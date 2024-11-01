
import CategoryFilter from "@/components/shared/CategoryFilter";
import Collections from "@/components/shared/Collections";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import Image from "next/image";
import Link from "next/link";

export default async function Home({searchParams}) {

  const searchText = searchParams?.query || ""
  const category = searchParams?.category || ""
  const data = await getAllEvents({
    query : searchText,
    category : category,
    page : 1,
    limit : 6
  })
  // console.log(data)
  return (
    <>
      <section className="bg-gray-50 bg-dotted-pattern bg-contain py-5 md:py-10 flex">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">Host, Connect, Celebrate: Your Events, Our Platform!</h1>
            <p className="p-regular-20 md:p-regular-24">Book and learn helpful tips from 3,168+ mentors in world-class companies with our global community</p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>
          {/* Move the image to the right column */}
          <div className="flex justify-center md:order-last">
            <Image src="/assets/images/hero.png" alt="hero" width={1000} height={1000} className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]" />
          </div>
        </div>
      </section>  
      
      <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Trusted By <br/> Thousands Of Events</h2>
        <div className="flex w-full max-sm:flex-col gap-5 md:flex-row">
          <Search/>
          <CategoryFilter/>
        </div>

        <Collections 
          data={data}
          emptyTitle = "No Events Found"
          emptyStateSubText = "ComeBack Later"
          collectionType = "All_Events"
          limit={6}
          page={1}
          totalPages={2}
        >
        
        </Collections>
      </section>
    </>
  )
}

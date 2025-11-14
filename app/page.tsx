import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { IEvent } from "@/database"
import { cacheLife } from "next/cache"
// import { MOCK_EVENTS } from "@/lib/constant"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const page = async () => {
  'use cache';
  cacheLife('hours')
  const response = await fetch(`${BASE_URL}/api/events`)
  const { events } = await response.json()

  return (
    <section>
      {/* h1: text-size 6xl -> 5xl，sm:text-4xl -> sm:text-3xl */}
      <h1 className="text-center">与顶尖链上团队，共建下一个传奇<br />不投简历，直接对话</h1>
      <p className="text-center mt-5">发现最新招聘需求、项目推荐与社区活动，找到你的梦想团队。</p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {/* {MOCK_EVENTS.map((e) => ( */}
          {events && events.length > 0 && events.map((e: IEvent) => (
            <li key={e.title} className="list-none">
              <EventCard {...e} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default page
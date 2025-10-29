import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { MOCK_EVENTS } from "@/lib/constant"

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <section>
      {/* h1: text-size 6xl -> 5xl，sm:text-4xl -> sm:text-3xl */}
      <h1 className="text-center">与顶尖链上团队，共建下一个传奇<br />不投简历，直接对话</h1>
      <p className="text-center mt-5">发现最新招聘需求、项目推荐与社区活动，找到你的梦想团队。</p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {MOCK_EVENTS.map((e) => (
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
export type EventCardProps = {
    image: string;
    title: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

export const MOCK_EVENTS: EventCardProps[] = [
    {
        image: "/images/event1.png",
        title: "Web3 春季招聘会",
        slug: "web3-spring-career-fair",
        location: "上海·张江科技园",
        date: "2025-03-15",
        time: "14:00-18:00"
    },
    {
        image: "/images/event2.png",
        title: "DeFi 创新黑客松",
        slug: "defi-innovation-hackathon",
        location: "杭州·云栖小镇",
        date: "2025-04-20",
        time: "全天"
    },
    {
        image: "/images/event3.png",
        title: "NFT 入门课程宣讲会",
        slug: "nft-beginner-course",
        location: "北京·中关村",
        date: "2025-03-22",
        time: "19:00-21:00"
    },
    {
        image: "/images/event4.png",
        title: "区块链技术峰会",
        slug: "blockchain-tech-summit",
        location: "深圳·前海",
        date: "2025-05-10",
        time: "09:00-17:00"
    },
    {
        image: "/images/event5.png",
        title: "元宇宙开发工作坊",
        slug: "metaverse-development-workshop",
        location: "成都·天府软件园",
        date: "2025-04-05",
        time: "10:00-16:00"
    }
]
export default MOCK_EVENTS
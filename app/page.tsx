

const page = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <section>
      <h1 className="text-center">与顶尖链上团队，共建下一个传奇<br />不投简历，直接对话</h1>
      <p className="text-center mt-5">发现最新招聘需求、项目推荐与社区活动，找到你的梦想团队。</p>
    </section>
  )
}

export default page
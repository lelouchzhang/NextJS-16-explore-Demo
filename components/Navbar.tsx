import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
    return (
        <header>
            <nav>
                <Link href="/" className="logo">
                    <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
                    <p>链上招聘</p>
                </Link>
                <ul>
                    <Link href="/">主页</Link>
                    <Link href="/">求职</Link>
                    <Link href="/">招募</Link>
                </ul>
            </nav>
        </header>
    )
}

export default Navbar
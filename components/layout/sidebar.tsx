import Link from "next/link"
import { Home, FileText } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="hidden md:block w-[270px] bg-gray-200 p-4">
      <nav className="space-y-4">
        <Link href="/" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-2">
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link href="/blog" className="flex items-center gap-3 text-gray-700 hover:text-gray-900 py-2">
          <FileText className="h-5 w-5" />
          <span>Our Blog</span>
        </Link>
      </nav>
    </aside>
  )
}

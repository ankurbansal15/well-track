import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          HealthCard
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/reports">Reports</Link>
            <Link href="/tracking">Tracking</Link>
          </nav>
          <ModeToggle />
          <Button variant="outline">Sign In</Button>
        </div>
      </div>
    </header>
  )
}


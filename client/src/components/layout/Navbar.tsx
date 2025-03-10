import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/quizzes", label: "Quiz Hub" },
    { href: "/zodiac-game", label: "Zodiac Game" },
    { href: "/match-generator", label: "Match Generator" },
  ];

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Sonal Says
          </Link>

          <div className="flex space-x-4">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location === href
                    ? "bg-primary-foreground/10 text-white"
                    : "hover:bg-primary-foreground/5 text-primary-foreground/80"
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

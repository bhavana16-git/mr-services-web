import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/common/Logo";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", to: ROUTES.home },
  { label: "About Us", to: ROUTES.about },
  { label: "Services", to: ROUTES.services },
  { label: "Why Choose Us", to: ROUTES.whyChooseUs },
  { label: "FAQ", to: ROUTES.faq },
  { label: "Blog", to: ROUTES.blog },
  { label: "Contact Us", to: ROUTES.contact },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium text-neutral-700 hover:text-primary-700 pb-1 border-b-2",
                  isActive ? "border-accent-500 text-primary-900" : "border-transparent",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to={ROUTES.signIn}>Sign In</Link>
          </Button>
          <Button asChild>
            <Link to={ROUTES.signUp}>Sign Up</Link>
          </Button>
        </div>

        <button
          className="lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="lg:hidden border-t border-neutral-200 bg-white">
          <Container className="flex flex-col gap-1 py-3">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-3 px-3">
              <Button variant="outline" className="flex-1" asChild>
                <Link to={ROUTES.signIn}>Sign In</Link>
              </Button>
              <Button className="flex-1" asChild>
                <Link to={ROUTES.signUp}>Sign Up</Link>
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}



import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";
import Container from "@/components/common/Container";
import { ROUTES } from "@/routes/routePaths";
import { BUSINESS, callLink } from "@/lib/constants";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 bg-primary-900 text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Logo dark />
          <p className="mt-4 text-sm text-white/70">
            Reliable accounting, co-operative society management, and English typing
            services in Santacruz East, Mumbai.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to={ROUTES.about} className="hover:text-accent-500">About Us</Link></li>
            <li><Link to={ROUTES.services} className="hover:text-accent-500">Services</Link></li>
            <li><Link to={ROUTES.whyChooseUs} className="hover:text-accent-500">Why Choose Us</Link></li>
            <li><Link to={ROUTES.faq} className="hover:text-accent-500">FAQ</Link></li>
            <li><Link to={ROUTES.blog} className="hover:text-accent-500">Blog</Link></li>
            <li><Link to={ROUTES.contact} className="hover:text-accent-500">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
            Services
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={`${ROUTES.services}#society`} className="hover:text-accent-500">Society Accounting</a></li>
            <li><a href={`${ROUTES.services}#business`} className="hover:text-accent-500">Business Accounting</a></li>
            <li><a href={`${ROUTES.services}#typing`} className="hover:text-accent-500">Typing Services</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>{BUSINESS.address}</li>
            <li>
              <a href={callLink(BUSINESS.phones[0])} className="hover:text-accent-500">
                {BUSINESS.phones.join(" / ")}
              </a>
            </li>
            <li>
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-accent-500">
                {BUSINESS.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-white/60 sm:flex-row">
          <span>&copy; {year} M. R. Services</span>
          <div className="flex gap-4">
            <Link to={ROUTES.terms} className="hover:text-accent-500">Terms of Service</Link>
            <Link to={ROUTES.privacy} className="hover:text-accent-500">Privacy Policy</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}



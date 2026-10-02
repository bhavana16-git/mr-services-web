import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link to={ROUTES.home} className="flex items-center gap-2" aria-label="M. R. Services home">
      <img
        src={dark ? "/logo/mr-logo-mono.png" : "/logo/mr-logo.png"}
        alt="M. R. Services"
        className="h-8 md:h-10 w-auto"
      />
    </Link>
  );
}


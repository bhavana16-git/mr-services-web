import { Link } from "react-router-dom";
import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/routePaths";

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found | M. R. Services" description="The page you're looking for could not be found." />
      <Container className="flex flex-col items-center justify-center py-32 text-center">
        <h1 className="font-heading text-5xl font-bold text-primary-900">404</h1>
        <p className="mt-3 text-neutral-700">Sorry, we couldn't find the page you were looking for.</p>
        <Button asChild className="mt-6"><Link to={ROUTES.home}>Back to Home</Link></Button>
      </Container>
    </>
  );
}


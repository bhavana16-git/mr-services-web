import { useEffect, useRef } from "react";
import { TURNSTILE_SITE_KEY } from "@/lib/constants";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (token: string) => void }) => void;
    };
  }
}

export default function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.turnstile && ref.current) {
        window.turnstile.render(ref.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: onToken,
        });
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [onToken]);

  return <div ref={ref} />;
}



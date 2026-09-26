/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // shadcn/ui system colors
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        // M. R. Services brand palette
        primary: {
          100: "var(--color-primary-100)",
          500: "var(--color-primary-500)",
          700: "var(--color-primary-700)",
          900: "var(--color-primary-900)",
        },
        accent: {
          100: "var(--color-accent-100)",
          500: "var(--color-accent-500)",
          600: "var(--color-accent-600)",
        },
        teal: {
          100: "var(--color-teal-100)",
          500: "var(--color-teal-500)",
        },
        danger: {
          100: "var(--color-danger-100)",
          500: "var(--color-danger-500)",
        },
        warning: { 500: "var(--color-warning-500)" },
        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          400: "var(--color-neutral-400)",
          700: "var(--color-neutral-700)",
          900: "var(--color-neutral-900)",
        },
        logo: {
          red: "var(--logo-red)",
          navy: "var(--logo-navy)",
        },
      },
      fontFamily: {
        heading: ["Sora Variable", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["Inter Variable", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        brand: "var(--radius-md)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
      },
    },
  },
  plugins: [],
};


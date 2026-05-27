/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        muted: { foreground: "hsl(var(--muted-foreground) / <alpha-value>)" },
        gold:   "hsl(var(--gold) / <alpha-value>)",
        teal:   "hsl(var(--teal) / <alpha-value>)",
        purple: "hsl(var(--purple) / <alpha-value>)",
        orange: "hsl(var(--orange) / <alpha-value>)",
        red:    "hsl(var(--red) / <alpha-value>)",
        blue:   "hsl(var(--blue) / <alpha-value>)",
        green:  "hsl(var(--green) / <alpha-value>)",
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  safelist: [
    { pattern: /^(bg|text|border)-(gold|teal|purple|orange|red|blue|green)\/(5|10|20|40)$/ },
    { pattern: /^(bg|text|border)-(gold|teal|purple|orange|red|blue|green)$/ },
  ],
  plugins: [],
};

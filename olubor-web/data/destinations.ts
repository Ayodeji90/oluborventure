export type Destination = {
  name: string;
  flag: string;
  tagline: string;
  highlights: string[];
};

export const destinations: Destination[] = [
  {
    name: "United Kingdom",
    flag: "🇬🇧",
    tagline: "One-year Master's degrees, globally recognized",
    highlights: ["1-Year Master's", "PSW Visa", "Scholarships up to 100%"],
  },
  {
    name: "Canada",
    flag: "🇨🇦",
    tagline: "PR-friendly pathways for students",
    highlights: ["PGWP", "PR Pathway", "Co-op Programs"],
  },
  {
    name: "United States",
    flag: "🇺🇸",
    tagline: "Top-ranked universities & funding options",
    highlights: ["STEM OPT", "Funding", "Ivy League"],
  },
  {
    name: "Germany",
    flag: "🇩🇪",
    tagline: "Low/no tuition with strong job market",
    highlights: ["Tuition-free Options", "Blue Card", "Engineering Hub"],
  },
  {
    name: "Australia",
    flag: "🇦🇺",
    tagline: "Work rights while you study",
    highlights: ["Post-study Work", "High Demand Skills", "Scholarships"],
  },
  {
    name: "United Arab Emirates",
    flag: "🇦🇪",
    tagline: "Fast-growing hub for careers & study",
    highlights: ["Tax-free Income", "Global Branch Campuses", "Easy Visas"],
  },
];

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  bullets: string[];
  icon: "graduation" | "money" | "plane";
};

export const services: Service[] = [
  {
    slug: "study-abroad",
    title: "Study Abroad",
    shortTitle: "Study Abroad",
    icon: "graduation",
    description:
      "Get admitted to top universities worldwide. We guide you through the entire application process, from selection to enrollment.",
    bullets: ["University Selection", "Application Support", "Visa Assistance"],
  },
  {
    slug: "scholarships",
    title: "Scholarships",
    shortTitle: "Scholarships",
    icon: "money",
    description:
      "Access fully-funded and partial scholarship opportunities. We help you find and secure financial aid for your education.",
    bullets: ["Scholarship Search", "Essay Writing", "Application Guidance"],
  },
  {
    slug: "visa-assistance",
    title: "Visa Assistance",
    shortTitle: "Visa Assistance",
    icon: "plane",
    description:
      "Navigate visa requirements with confidence. From documentation to interview prep, we make sure you're ready.",
    bullets: ["Document Review", "Interview Prep", "Application Filing"],
  },
  {
    slug: "international-jobs",
    title: "International Jobs",
    shortTitle: "Intl. Jobs",
    icon: "plane",
    description:
      "Launch your global career with our job placement services. We connect you with employers across various industries.",
    bullets: ["Job Matching", "CV Optimization", "Interview Prep"],
  },
];

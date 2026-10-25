export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  bullets: string[];
  icon: "graduation" | "money" | "plane" | "language" | "ticket";
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
  {
    slug: "canada-processing",
    title: "Canada 🇨🇦 Processing",
    shortTitle: "Canada",
    icon: "graduation",
    description:
      "Your complete pathway to Canada — study permits, visitor visas, and proof-of-funds documentation, handled end to end.",
    bullets: ["Admissions Processing", "IRCC Visa Filing", "Proof of Funds Guidance", "Biometrics & Interview Prep"],
  },
  {
    slug: "french-tutoring",
    title: "French Tutoring",
    shortTitle: "French",
    icon: "language",
    description:
      "Learn French with an experienced teacher, built for your goals — exam success, relocation readiness, or everyday fluency.",
    bullets: ["DELF / TEF Exam Prep", "Private & Group Classes", "Conversational Practice"],
  },
  {
    slug: "flight-booking",
    title: "Flight Booking",
    shortTitle: "Flights",
    icon: "ticket",
    description:
      "Get where you're going without the stress. We search the best fares, book, and back you up if plans change.",
    bullets: ["Best-Fare Search", "Booking & Ticketing", "Reschedule & Refund Support"],
  },
];

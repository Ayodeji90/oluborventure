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
      "We know which universities in the UK, Canada, and Germany are processing Nigerian applications right now — and which ones aren't. We put your application where it has the best chance.",
    bullets: ["University Selection", "Application Strategy", "Offer Negotiation"],
  },
  {
    slug: "scholarships",
    title: "Scholarships",
    shortTitle: "Scholarships",
    icon: "money",
    description:
      "Most students don't hear about scholarships until they've already paid. We identify funding opportunities before you sign anything — full awards, partial grants, and combinations.",
    bullets: ["Scholarship Matching", "Personal Statement Writing", "Application Coaching"],
  },
  {
    slug: "visa-assistance",
    title: "Visa Assistance",
    shortTitle: "Visa Assistance",
    icon: "plane",
    description:
      "The visa refusal rate for Nigerian students is higher than most countries. We know the common reasons and prepare your documentation specifically to avoid them.",
    bullets: ["Document Review", "Interview Preparation", "Refusal Prevention"],
  },
  {
    slug: "international-jobs",
    title: "International Jobs",
    shortTitle: "Intl. Jobs",
    icon: "plane",
    description:
      "Getting the degree is one step. Getting hired abroad is another. We help graduates and professionals land roles across the UK, Germany, Canada, and the UAE.",
    bullets: ["Job Matching", "CV & LinkedIn Optimisation", "Work Visa Guidance"],
  },
  {
    slug: "canada-processing",
    title: "Canada 🇨🇦 Processing",
    shortTitle: "Canada",
    icon: "graduation",
    description:
      "Your complete pathway to Canada — study permits, visitor visas, and proof-of-funds documentation, handled end to end from Lagos.",
    bullets: ["Admissions Processing", "IRCC Visa Filing", "Proof of Funds Guidance", "Biometrics & Interview Prep"],
  },
  {
    slug: "french-tutoring",
    title: "French Tutoring",
    shortTitle: "French",
    icon: "language",
    description:
      "French opens doors in Canada, France, Belgium, and Switzerland. Learn with an experienced teacher — whether your goal is exam certification, relocation, or everyday fluency.",
    bullets: ["DELF / TEF Exam Prep", "Private & Group Classes", "Conversational Practice"],
  },
  {
    slug: "flight-booking",
    title: "Flight Booking",
    shortTitle: "Flights",
    icon: "ticket",
    description:
      "Get where you're going without the stress. We search the best fares, handle the booking, and support you if plans change — so one less thing is on your mind.",
    bullets: ["Best-Fare Search", "Booking & Ticketing", "Reschedule & Refund Support"],
  },
];

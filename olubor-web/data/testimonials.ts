export type Testimonial = {
  initials: string;
  name: string;
  detail: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    initials: "AO",
    name: "Adeola O.",
    detail: "MSc Data Science, UK",
    quote:
      "Olubor Ventures made my dream of studying in the UK a reality. Their guidance throughout the application process was invaluable.",
  },
  {
    initials: "CI",
    name: "Chinedu I.",
    detail: "Full Scholarship, Canada",
    quote:
      "I got a full scholarship to study in Canada! The team helped me perfect my essays and prepare for interviews. Forever grateful!",
  },
  {
    initials: "FM",
    name: "Fatima M.",
    detail: "Software Engineer, Germany",
    quote:
      "From Nigeria to Germany — Olubor Ventures helped me land my dream job. Their career coaching and CV review were game-changers!",
  },
];

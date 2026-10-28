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
    detail: "MSc Data Science, University of Manchester · UK",
    quote:
      "I was rejected twice before Olubor. Third application, UK student visa approved. The team knew exactly what went wrong — and fixed it.",
  },
  {
    initials: "CI",
    name: "Chinedu I.",
    detail: "Full Scholarship, University of Calgary · Canada",
    quote:
      "My family couldn't afford full tuition in Canada. Olubor found me a scholarship I had no idea existed — covers fees and living costs. I didn't pay a naira in tuition.",
  },
  {
    initials: "FM",
    name: "Fatima M.",
    detail: "Software Engineer, Berlin · Germany",
    quote:
      "I came to them for university help and ended up with a job offer in Germany two years later. They helped me with both, and never made me feel like a number.",
  },
];

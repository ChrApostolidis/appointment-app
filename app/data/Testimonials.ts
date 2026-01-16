export interface Testimonial {
  id: number;
  name: string;
  review: string;
  image: string;
  role: "Provider" | "User";
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Morgan",
    review:
      "AppointMe made booking services insanely easy. I found a fitness trainer, scheduled a session, and was done in under two minutes. No back-and-forth, no hassle.",
    role: "User",
    image: "char1.jpg",
  },
  {
    id: 2,
    name: "Olivia Brooks",
    review:
      "Before AppointMe, booking appointments across different services felt scattered and frustrating. Now everything lives in one place. I can compare providers, check availability instantly, and book without sending a single message. It honestly feels like how scheduling should have worked years ago.",
    role: "User",
    image: "char7.jpg",
  },
  {
    id: 3,
    name: "Sofia Ramirez",
    review:
      "As a freelance designer, AppointMe helps me manage clients without the chaos. My availability stays organized and clients book exactly when I want them to.",
    role: "Provider",
    image: "char4.jpg",
  },
  {
    id: 4,
    name: "Marcus Hill",
    review:
      "Running my consulting business used to mean endless emails just to lock down a meeting time. AppointMe completely eliminated that. Clients pick a slot, get reminders automatically, and show up prepared. It’s saved me hours every week and made my business feel far more professional.",
    role: "Provider",
    image: "char5.jpg",
  },
  {
    id: 5,
    name: "Daniel Lee",
    review:
      "I love how many categories AppointMe supports. From doctors to tutors to home services — it’s basically my go-to app for scheduling anything.",
    role: "User",
    image: "char8.jpg",
  },
  {
    id: 6,
    name: "Hannah Kim",
    review:
      "What I appreciate most about AppointMe is how clear and stress-free the experience is. No confusing steps, no unnecessary forms. I book what I need, when I need it, and I get instant confirmation. It’s simple, fast, and surprisingly satisfying to use.",
    role: "User",
    image: "char6.jpg",
  },
  {
    id: 7,
    name: "Priya Shah",
    review:
      "AppointMe cut my admin work in half. Clients book, reschedule, or cancel on their own, and I can focus on actually delivering my services.",
    role: "Provider",
    image: "char7.jpg",
  },
  {
    id: 8,
    name: "Ethan Wallace",
    review:
      "I offer services across multiple categories, and AppointMe handles it effortlessly. Managing availability, avoiding double bookings, and keeping everything organized is now automatic. It feels like having a virtual assistant that never messes up.",
    role: "Provider",
    image: "char10.jpg",
  },
  {
    id: 9,
    name: "Michael Thompson",
    review:
      "Clean interface, fast bookings, and zero confusion. AppointMe feels modern and thoughtfully built — exactly what a scheduling app should be.",
    role: "User",
    image: "char11.jpg",
  },
  {
    id: 10,
    name: "Natalie Foster",
    review:
      "I’ve tried a lot of scheduling apps, but AppointMe stands out because it actually feels user-first. Everything is intuitive, responsive, and quick. I don’t have to think about how it works — I just book and move on with my day.",
    role: "User",
    image: "char9.jpg",
  },
  {
    id: 11,
    name: "Emily Carter",
    review:
      "I run a small wellness business and AppointMe has been a game changer. My clients love how simple it is, and I love how professional it makes my workflow feel.",
    role: "Provider",
    image: "char13.jpg",
  },
  {
    id: 12,
    name: "Lucas Pereira",
    review:
      "AppointMe helped me scale without adding extra overhead. As my client base grew, scheduling didn’t become a problem — it became easier. Automated bookings, reminders, and a clean dashboard make this an essential tool for any provider.",
    role: "Provider",
    image: "char12.jpg",
  },
  {
    id: 13,
    name: "Jason Nguyen",
    review:
      "Booking appointments across different services used to be a mess. AppointMe finally put everything in one place for me.",
    role: "User",
    image: "char2.jpg",
  },
  {
    id: 14,
    name: "Laura Bennett",
    review:
      "Setup was quick, customization was easy, and clients started booking immediately. AppointMe just works.",
    role: "Provider",
    image: "char14.jpg",
  }
];

export default testimonials;

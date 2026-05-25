import { AsciiPattern } from "./ascii-pattern";
import { Star } from "lucide-react";

type Review = {
  name: string;
  role: string;
  quote: string;
  initial: string;
};

const reviews: Review[] = [
  {
    name: "Maya R.",
    role: "Bride",
    quote: "We kept saying the site felt calm, even when our schedule was not. That mattered more than we expected.",
    initial: "M",
  },
  {
    name: "Jonas T.",
    role: "Groom",
    quote: "I usually avoid planning tools, but this one made it easy to stay involved without feeling overwhelmed.",
    initial: "J",
  },
  {
    name: "Amina K.",
    role: "Bride",
    quote: "The guest list stayed organized from day one. We could breathe a little and focus on the actual celebration.",
    initial: "A",
  },
  {
    name: "Elena P.",
    role: "Wedding Planner",
    quote: "It has the kind of polish clients notice immediately. Clean, warm, and genuinely useful.",
    initial: "E",
  },
  {
    name: "Noah S.",
    role: "Groom",
    quote: "The reminders were thoughtful rather than noisy. That made the whole planning process feel lighter.",
    initial: "N",
  },
  {
    name: "Lina M.",
    role: "Bride",
    quote: "We shared it with family and everyone understood the plan right away. No long explanations needed.",
    initial: "L",
  },
  {
    name: "Sara D.",
    role: "Venue Manager",
    quote: "The layout feels premium, but it still stays friendly and easy to use. That balance is hard to get right.",
    initial: "S",
  },
  {
    name: "Tom A.",
    role: "Best Man",
    quote: "I was only helping out, but I ended up checking the schedule every day because it was that clear.",
    initial: "T",
  },
  {
    name: "Rania F.",
    role: "Bride",
    quote: "It felt like someone designed it with real wedding stress in mind. Very human, very steady.",
    initial: "R",
  },
  {
    name: "Omar B.",
    role: "Groom",
    quote: "No clutter, no confusion, just a clean flow that helped us move forward without second-guessing everything.",
    initial: "O",
  },
  {
    name: "Nadia H.",
    role: "Bride",
    quote: "We loved that it looked elegant without being overdesigned. It matched our whole mood perfectly.",
    initial: "N",
  },
  {
    name: "Youssef A.",
    role: "Groom",
    quote: "The site gave us structure when we needed it and space when we did not. That is a rare combo.",
    initial: "Y",
  },
  {
    name: "Mira C.",
    role: "Bride",
    quote: "It made the planning feel less like admin and more like building something meaningful together.",
    initial: "M",
  },
  {
    name: "Hassan E.",
    role: "Groom",
    quote: "We never lost track of the important pieces. That peace of mind was worth a lot.",
    initial: "H",
  },
  {
    name: "Clara V.",
    role: "Event Designer",
    quote: "You can tell the details were cared for. The experience feels intentional from the first click.",
    initial: "C",
  },
  {
    name: "Imane Z.",
    role: "Bride",
    quote: "It helped us keep the day personal instead of getting buried in spreadsheets and scattered notes.",
    initial: "I",
  },
  {
    name: "Bilal N.",
    role: "Groom",
    quote: "Simple to learn, beautiful to look at, and steady enough that we trusted it with real decisions.",
    initial: "B",
  },
  {
    name: "Dina L.",
    role: "Bride",
    quote: "The whole thing felt reassuring. Even our parents figured it out quickly, which says a lot.",
    initial: "D",
  },
  {
    name: "Karim O.",
    role: "Groom",
    quote: "Nothing felt forced. It just made the planning calmer and the day itself easier to prepare for.",
    initial: "K",
  },
  {
    name: "Selma I.",
    role: "Bride",
    quote: "The tone is warm, the structure is clear, and the whole thing feels like it was made by people who care.",
    initial: "S",
  },
];

function StarRow() {
  return (
    <div className="flex items-center gap-1 text-[#f7d56b]">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-3.5 w-3.5 fill-current" />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="group min-w-[320px] max-w-[320px] lg:min-w-[360px] lg:max-w-[360px] rounded-[28px] border border-white/12 bg-white/[0.05] p-6 backdrop-blur-md shadow-[0_20px_80px_rgba(0,0,0,0.28)] transition-transform duration-300 hover:-translate-y-1 hover:border-white/22 hover:bg-white/[0.075]">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-white/10 text-sm font-semibold text-white/95">
            {review.initial}
          </div>
          <div>
            <p className="font-medium text-white">{review.name}</p>
            <p className="text-sm text-white/60">{review.role}</p>
          </div>
        </div>
        <StarRow />
      </div>

      <p className="text-[15px] leading-7 text-white/78">{review.quote}</p>
    </article>
  );
}

function ReviewTrack({ items, direction = "left" }: { items: Review[]; direction?: "left" | "right" }) {
  const loopedItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div className={`flex w-max gap-5 py-4 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}>
        {loopedItems.map((review, index) => (
          <ReviewCard key={`${review.name}-${index}`} review={review} />
        ))}
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const topRow = reviews.slice(0, 10);
  const bottomRow = reviews.slice(10);

  return (
    <section id="reviews" className="relative py-28 lg:py-36 bg-background text-foreground overflow-hidden border-t border-background/10">
      <AsciiPattern />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-white/45 mb-4">
            <span className="w-12 h-px bg-white/18" />
            Reviews
          </span>
          <h2 className="text-4xl lg:text-5xl font-display leading-tight">
            Quiet praise from couples and planners
            <span className="text-white/40"> who needed the day to feel easy.</span>
          </h2>
          <p className="mt-5 max-w-2xl text-base lg:text-lg leading-7 text-white/60">
            A soft, moving wall of handwritten-style feedback that matches the site’s calm, premium feel.
          </p>
        </div>

        <div className="space-y-5">
          <ReviewTrack items={topRow} direction="left" />
          <ReviewTrack items={bottomRow} direction="right" />
        </div>
      </div>

      <style>{`
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-marquee-left {
          animation: marquee-left 45s linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-right 45s linear infinite;
        }

        .animate-marquee-left:hover,
        .animate-marquee-right:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
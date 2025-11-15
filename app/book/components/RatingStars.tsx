import { Star } from "lucide-react";

interface startProps {
  value: number; // current rating (0..max)
  max?: number; // optional, default 5
  size?: number; // optional pixel size for each star, default 20
};

export default function RatingStars({ value, max = 5, size = 20 }: startProps) {
  const stars = Array.from({ length: max }, (_, i) => {
    const idx = i + 1;
    const filled = Math.max(0, Math.min(1, value - (idx - 1)));

    const isFull = filled >= 1;

    return (
     <Star 
       key={i}
       size={size}
       color={isFull ? "#f5a623" : "#e5e7eb"}
       style={{ marginRight: 4 }}
     />
    );
  });

  return (
    <div className="flex" role="img" aria-label={`Rating: ${value} out of ${max}`}>
      {stars}
    </div>
  );
}

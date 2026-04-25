export interface HeroItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: string;
  link: string;
}

export const heroContent: HeroItem[] = [
  {
    id: 1,
    title: "The Rise of VTAGU",
    description: "Experience the next level of immersive storytelling. Watch our latest original series and movies in stunning 4K HDR.",
    image: "/assets/dashboard/thumb1.png",
    category: "Featured",
    rating: "4.9",
    link: "/movie/1"
  },
  {
    id: 2,
    title: "Neon Shadows",
    description: "In a city ruled by light, the darkest secrets hide in the shadows. A gripping cyberpunk thriller.",
    image: "https://images.unsplash.com/photo-1542204113-e93847e2124b?q=80&w=1974&auto=format&fit=crop",
    category: "Trending",
    rating: "4.7",
    link: "/movie/2"
  },
  {
    id: 3,
    title: "Galactic Frontier",
    description: "The journey to the stars is just the beginning. Explore the vast unknown in this epic space adventure.",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2072&auto=format&fit=crop",
    category: "Exclusive",
    rating: "4.8",
    link: "/movie/3"
  },
  {
    id: 4,
    title: "Forgotten Realms",
    description: "Magic has been lost for centuries, until now. Join the quest to restore balance to the world.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2168&auto=format&fit=crop",
    category: "Original",
    rating: "4.5",
    link: "/movie/4"
  }
];

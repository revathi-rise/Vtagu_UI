export type Movie = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  rating?: number;
  duration?: string;
  genre?: string;
  quality?: 'HD' | '4K';
  featured?: boolean;
};

export const heroSlides: Movie[] = [
  {
    id: "hero-1",
    title: "The Last Hunt",
    description:
      "In a world where survival is the only law, one man must face his past.",
    imageUrl:
      "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop",
    rating: 4.9,
    genre: "Action",
    duration: "2h 10m",
    quality: "4K",
    featured: true
  },
  {
    id: "hero-2",
    title: "Neon Shadows",
    description:
      "A cyberpunk assassin uncovers a conspiracy in a neon-lit future.",
    imageUrl:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=2070&auto=format&fit=crop",
    rating: 4.8,
    genre: "Sci-Fi",
    duration: "1h 58m",
    quality: "4K"
  },
  {
    id: "hero-3",
    title: "Empire Rising",
    description:
      "A young warrior leads a rebellion against a tyrannical empire.",
    imageUrl:
      "https://images.unsplash.com/photo-1517602302552-471fe67acf66?q=80&w=2070&auto=format&fit=crop",
    rating: 4.7,
    genre: "Adventure",
    duration: "2h 20m",
    quality: "HD"
  }
];

export const featuredMovie: Movie = {
  id: 'featured-1',
  title: 'The Last Hunt',
  description: 'In a world where survival is the only law, one man must face his past to protect his future. Experience the epic cinematic event of the year.',
  imageUrl: '/featured-bg.jpg', // Placeholder, we will use a color fill or unsplash
  rating: 4.9,
  featured: true,
};

export const trendingMovies: Movie[] = [
  {
    id: 'trend-1',
    title: 'Shadow Ops',
    description: 'Elite squad behind enemy lines.',
    imageUrl: '/trend1.jpg',
    genre: 'Action',
    duration: '2h 15m',
    quality: 'HD'
  },
  {
    id: 'trend-2',
    title: 'Neon Skies',
    description: 'Cyberpunk adventure.',
    imageUrl: '/trend2.jpg',
    genre: 'Sci-Fi',
    duration: '1h 50m',
    quality: '4K'
  },
  {
    id: 'trend-3',
    title: 'Eternal Heart',
    description: 'A timeless romance.',
    imageUrl: '/trend3.jpg',
    genre: 'Drama',
    duration: '2h 05m',
    quality: 'HD'
  },
  {
    id: 'trend-4',
    title: 'The Silent Guest',
    description: 'Who is knocking?',
    imageUrl: '/trend4.jpg',
    genre: 'Horror',
    duration: '1h 38m',
    quality: 'HD'
  }
];

export const popularMovies: Movie[] = [
  { id: 'pop-1', title: 'Cosmic Hero', description: '', imageUrl: '/pop1.jpg' },
  { id: 'pop-2', title: 'Robo Dawn', description: '', imageUrl: '/pop2.jpg' },
  { id: 'pop-3', title: 'Paris Call', description: '', imageUrl: '/pop3.jpg' },
  { id: 'pop-4', title: 'Mars Walk', description: '', imageUrl: '/pop4.jpg' },
  { id: 'pop-5', title: 'Childhood', description: '', imageUrl: '/pop5.jpg' },
  { id: 'pop-6', title: 'The Hooded', description: '', imageUrl: '/pop6.jpg' }
];

export const topPicks: Movie[] = [
  {
    id: 'pick-1',
    title: 'Vanish in the Night',
    description: 'A gritty detective thriller set in the heart of a city that never sleeps. Explore the dark underbelly of a neon-lit metropolis.',
    imageUrl: '/pick1.jpg'
  },
  {
    id: 'pick-2',
    title: 'Velocity Limit',
    description: 'High-octane racing where the stakes are higher than the speed limits. Experience the rush of professional street racing.',
    imageUrl: '/pick2.jpg'
  }
];

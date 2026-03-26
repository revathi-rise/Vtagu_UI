import MoviesHero from "./components/MoviesHero";
import Top10Row from "./components/Top10Row";
import CategoryRow from "./components/CategoryRow";

const actionMovies = [
  { title: "Extraction Point", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop" },
  { title: "The Vault", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", image: "https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=600&auto=format&fit=crop" },
  { title: "Overdrive", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop" },
  { title: "Last Stand", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", image: "https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?q=80&w=600&auto=format&fit=crop" },
  { title: "Bulletstorm", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", image: "https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=600&auto=format&fit=crop" },
  { title: "Rogue Protocol", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop" },
];

const sciFiMovies = [
  { title: "Neon Genesis", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop" },
  { title: "Stellar Void", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", image: "https://images.unsplash.com/photo-1535016120720-40c746a6580c?q=80&w=600&auto=format&fit=crop" },
  { title: "Horizon", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop" },
  { title: "Cyber Rift", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop" },
  { title: "Quantum", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", image: "https://images.unsplash.com/photo-1485282271306-3bc5562d98ef?q=80&w=600&auto=format&fit=crop" },
  { title: "Dark Matter", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop" },
];

const thrillers = [
  { title: "The Silent Echo", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", image: "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=600&auto=format&fit=crop" },
  { title: "Internal Affairs", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop" },
  { title: "Midnight Velocity", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4", image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop" },
  { title: "The Watcher", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", image: "https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=600&auto=format&fit=crop" },
  { title: "No Escape", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4", image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop" },
  { title: "Mind Hunter", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop" },
];

export const metadata = {
  title: 'Movies - PrimeTime',
  description: 'Explore our massive library of Blockbusters, Sci-Fi thrillers, and award-winning masterpieces in 4K HDR.',
};

export default function MoviesPage() {
  return (
    <main className="min-h-screen bg-[#0f0a19] text-white overflow-x-hidden pb-12">
      <MoviesHero />
      <div className="-mt-32 relative z-20 space-y-4">
        <Top10Row />
        <CategoryRow title="Blockbuster Action" items={actionMovies} />
        <CategoryRow title="Mind-Bending Sci-Fi" items={sciFiMovies} />
        <CategoryRow title="Critically Acclaimed Thrillers" items={thrillers} />
      </div>
    </main>
  );
}
